const PaymentService = require('../../services/paymentService');
const { Order } = require('../../models');

// =============================
// Tạo thanh toán VNPay
// =============================
const createVNPayPayment = async (req, res) => {
    try {
        const { orderId, amount, orderDescription, bankCode } = req.body;

        // Validate input
        if (!orderId || !amount) {
            return res.status(400).json({
                ok: false,
                message: 'Thiếu thông tin orderId hoặc amount'
            });
        }

        // Kiểm tra order có tồn tại và thuộc về user không
        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                ok: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Tạo payment URL
        const result = await PaymentService.createVNPayPayment({
            orderId: order._id.toString(),
            amount: order.totalAmount,
            orderDescription: orderDescription || `Thanh toán đơn hàng ${order._id}`,
            bankCode: bankCode || ''
        });

        if (result.success) {
            // Cập nhật trạng thái đơn hàng
            order.paymentStatus = 'processing';
            await order.save();

            return res.json({
                ok: true,
                message: 'Tạo link thanh toán thành công',
                paymentUrl: result.paymentUrl,
                orderId: result.orderId
            });
        } else {
            return res.status(500).json({
                ok: false,
                message: result.error || 'Không thể tạo link thanh toán'
            });
        }
    } catch (error) {
        console.error('❌ Create VNPay payment error:', error);
        res.status(500).json({
            ok: false,
            message: 'Lỗi server khi tạo thanh toán',
            error: error.message
        });
    }
};

// =============================
// Xử lý VNPay callback
// =============================
const handleVNPayCallback = async (req, res) => {
    try {
        const vnp_Params = req.query;

        // Xác thực chữ ký
        const isValid = PaymentService.verifyVNPayCallback(vnp_Params);

        if (!isValid) {
            return res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=Invalid signature`);
        }

        const orderId = vnp_Params['vnp_TxnRef'];
        const responseCode = vnp_Params['vnp_ResponseCode'];

        const order = await Order.findById(orderId);
        if (!order) {
            return res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=Order not found`);
        }

        // ResponseCode = 00 nghĩa là thành công
        if (responseCode === '00') {
            order.paymentStatus = 'paid';
            order.status = 'Confirmed';
            await order.save();

            return res.redirect(`${process.env.CLIENT_URL}/payment/success?orderId=${orderId}`);
        } else {
            order.paymentStatus = 'failed';
            await order.save();

            return res.redirect(`${process.env.CLIENT_URL}/payment/failed?orderId=${orderId}&code=${responseCode}`);
        }
    } catch (error) {
        console.error('❌ VNPay callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=Server error`);
    }
};

// =============================
// Tạo thanh toán Momo
// =============================
const createMomoPayment = async (req, res) => {
    try {
        const { orderId, orderDescription } = req.body;

        if (!orderId) {
            return res.status(400).json({
                ok: false,
                message: 'Thiếu thông tin orderId'
            });
        }

        // Kiểm tra order
        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                ok: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Tạo payment
        const result = await PaymentService.createMomoPayment({
            orderId: order._id.toString(),
            amount: order.totalAmount,
            orderDescription: orderDescription || `Thanh toán đơn hàng ${order._id}`
        });

        if (result.success) {
            order.paymentStatus = 'processing';
            await order.save();

            return res.json({
                ok: true,
                message: 'Tạo link thanh toán Momo thành công',
                paymentUrl: result.paymentUrl,
                qrCode: result.qrCode,
                orderId: result.orderId
            });
        } else {
            return res.status(500).json({
                ok: false,
                message: result.error || 'Không thể tạo link thanh toán Momo'
            });
        }
    } catch (error) {
        console.error('❌ Create Momo payment error:', error);
        res.status(500).json({
            ok: false,
            message: 'Lỗi server khi tạo thanh toán',
            error: error.message
        });
    }
};

// =============================
// Xử lý Momo callback
// =============================
const handleMomoCallback = async (req, res) => {
    try {
        const params = req.body;

        // Xác thực chữ ký
        const isValid = PaymentService.verifyMomoCallback(params);

        if (!isValid) {
            return res.status(400).json({
                ok: false,
                message: 'Invalid signature'
            });
        }

        const orderId = params.orderId;
        const resultCode = params.resultCode;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                ok: false,
                message: 'Order not found'
            });
        }

        // resultCode = 0 nghĩa là thành công
        if (resultCode === 0) {
            order.paymentStatus = 'paid';
            order.status = 'Confirmed';
            await order.save();

            return res.json({
                ok: true,
                message: 'Thanh toán thành công'
            });
        } else {
            order.paymentStatus = 'failed';
            await order.save();

            return res.json({
                ok: false,
                message: 'Thanh toán thất bại'
            });
        }
    } catch (error) {
        console.error('❌ Momo callback error:', error);
        res.status(500).json({
            ok: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// =============================
// Xử lý Momo return (redirect từ Momo về)
// =============================
const handleMomoReturn = async (req, res) => {
    try {
        const params = req.query;
        const orderId = params.orderId;
        const resultCode = params.resultCode;

        if (resultCode === '0') {
            return res.redirect(`${process.env.CLIENT_URL}/payment/success?orderId=${orderId}`);
        } else {
            return res.redirect(`${process.env.CLIENT_URL}/payment/failed?orderId=${orderId}&code=${resultCode}`);
        }
    } catch (error) {
        console.error('❌ Momo return error:', error);
        res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=Server error`);
    }
};

// =============================
// Kiểm tra trạng thái thanh toán
// =============================
const checkPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                ok: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        return res.json({
            ok: true,
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
            totalAmount: order.totalAmount
        });
    } catch (error) {
        console.error('❌ Check payment status error:', error);
        res.status(500).json({
            ok: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

module.exports = {
    createVNPayPayment,
    handleVNPayCallback,
    createMomoPayment,
    handleMomoCallback,
    handleMomoReturn,
    checkPaymentStatus
};
