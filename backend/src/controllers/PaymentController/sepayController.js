const { Order, PaymentTransaction } = require('../../models');

/**
 * POST /payment/sepay/webhook
 * Không cần auth — SePay server gọi trực tiếp vào endpoint này
 * khi có giao dịch chuyển khoản vào tài khoản ngân hàng.
 *
 * Luồng xử lý 7 bước:
 * 1. Xác thực API key từ header
 * 2. Lấy payload từ SePay
 * 3. Chống duplicate bằng sepay_id
 * 4. Bóc tách orderCode từ nội dung chuyển khoản
 * 5. Cập nhật Order → paymentStatus: paid, status: Confirmed
 * 6. Lưu PaymentTransaction vào DB
 * 7. Trả 200 cho SePay (bắt buộc, SePay cần 200 để không retry)
 */
const handleSepayWebhook = async (req, res) => {
    try {
        // === BƯỚC 1: Xác thực API key từ SePay ===
        const authHeader = req.headers['authorization'];
        const expectedAuth = `Apikey ${process.env.SEPAY_WEBHOOK_SECRET}`;

        // Debug: log để so sánh header thực tế vs expected
        console.log('[SePay] Auth nhận được :', authHeader);
        console.log('[SePay] Auth mong đợi   :', expectedAuth);

        if (!authHeader || authHeader !== expectedAuth) {
            console.warn('[SePay] ❌ Unauthorized — Header không khớp!');
            console.warn('  Nhận:', JSON.stringify(authHeader));
            console.warn('  Cần :', JSON.stringify(expectedAuth));
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }


        // === BƯỚC 2: Nhận payload ===
        const { id, transferAmount, content, referenceCode, transactionDate } = req.body;

        console.log(`[SePay] Nhận giao dịch ID: ${id} | Số tiền: ${transferAmount} | Nội dung: ${content}`);

        // === BƯỚC 3: Chống duplicate (Idempotency) ===
        const existingTx = await PaymentTransaction.findOne({ sepay_id: String(id) });
        if (existingTx) {
            console.log(`[SePay] Giao dịch ${id} đã tồn tại, bỏ qua.`);
            return res.status(200).json({
                success: true,
                message: 'Giao dịch đã được xử lý trước đó',
                orderCode: existingTx.order_code,
                data: existingTx
            });
        }

        // === BƯỚC 4: Bóc tách orderCode từ nội dung CK ===
        // Normalize: xóa khoảng trắng, chuyển uppercase để tránh sai sót
        // Nhiều ngân hàng tự strip ký tự đặc biệt khi truyền về webhook
        const normalizedContent = (content || '').replace(/\s+/g, '').toUpperCase();
        const prefix = (process.env.SEPAY_MATCH_PREFIX || 'DH').toUpperCase();

        // Match format: DH + số liên tiếp (DH17786409582575047)
        // Prefix "DH" khớp với filter SePay dashboard
        const match = normalizedContent.match(new RegExp(`${prefix}\\d+`));
        const orderCode = match ? match[0] : null;

        let orderId = null;
        let finalStatus = orderCode ? 'MATCHED' : 'UNMATCHED';

        // === BƯỚC 5: Cập nhật Order nếu tìm thấy mã ===
        if (orderCode) {
            try {
                const order = await Order.findOneAndUpdate(
                    { orderCode: orderCode, paymentStatus: 'unpaid' },
                    {
                        paymentStatus: 'paid',
                        status: 'Confirmed'
                    },
                    { new: true }
                );

                if (order) {
                    orderId = order._id;
                    console.log(`[SePay] Đã cập nhật Order ${orderCode} → paymentStatus: paid`);
                } else {
                    console.warn(`[SePay] Khớp mã nhưng không tìm thấy Order UNPAID: ${orderCode}`);
                    finalStatus = 'UNMATCHED';
                }
            } catch (orderErr) {
                console.error(`[SePay] Lỗi khi cập nhật Order ${orderCode}:`, orderErr);
            }
        }

        // === BƯỚC 6: Lưu giao dịch vào PaymentTransaction ===
        const newTx = new PaymentTransaction({
            sepay_id: String(id),
            order_id: orderId,
            order_code: orderCode,
            amount: transferAmount,
            reference_code: referenceCode || '',
            raw_content: content || '',
            status: finalStatus,
            transaction_date: transactionDate ? new Date(transactionDate) : new Date()
        });

        const savedTx = await newTx.save();
        console.log(`[SePay] Đã lưu PaymentTransaction ${id} | Status: ${finalStatus}`);

        // === BƯỚC 7: Trả 200 cho SePay ===
        return res.status(200).json({
            success: true,
            message: 'Xử lý giao dịch thành công',
            orderCode: orderCode,
            data: savedTx
        });

    } catch (error) {
        console.error('[SePay] Lỗi webhook:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi server khi xử lý giao dịch' });
    }
};

/**
 * GET /payment/sepay/check-status/:orderCode
 * Frontend polling mỗi 3 giây để check xem tiền đã về chưa.
 * Trả về { status: 'PAID' } hoặc { status: 'PENDING' }
 */
const checkSepayStatus = async (req, res) => {
    try {
        const { orderCode } = req.params;

        // Tìm giao dịch đã MATCHED với orderCode này
        const tx = await PaymentTransaction.findOne({
            order_code: orderCode.toUpperCase(),
            status: 'MATCHED'
        });

        if (tx) {
            // Safety net: đảm bảo Order cũng được cập nhật
            // (trường hợp webhook xử lý xong nhưng DB write chậm)
            await Order.findOneAndUpdate(
                { orderCode: orderCode.toUpperCase(), paymentStatus: 'unpaid' },
                { paymentStatus: 'paid', status: 'Confirmed' }
            );

            return res.status(200).json({ status: 'PAID', orderCode });
        } else {
            return res.status(200).json({ status: 'PENDING', orderCode });
        }
    } catch (error) {
        console.error('[SePay] Lỗi check status:', error.message);
        return res.status(500).json({ ok: false, message: 'Lỗi server' });
    }
};

module.exports = { handleSepayWebhook, checkSepayStatus };
