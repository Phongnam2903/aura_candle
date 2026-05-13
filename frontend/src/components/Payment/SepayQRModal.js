import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Loader2, X, Copy } from "lucide-react";
import { checkSepayStatus } from "../../api/payment/paymentApi";

/**
 * SepayQRModal — Hiển thị mã QR VietQR và tự động polling mỗi 3 giây
 * để phát hiện khi bệnh nhân / khách hàng đã chuyển khoản.
 *
 * Props:
 *   order      — Object chứa { orderCode, totalAmount }
 *   isOpen     — Boolean điều khiển hiển thị modal
 *   onClose    — Callback khi đóng modal
 *   onSuccess  — Callback khi phát hiện thanh toán thành công
 */
const SepayQRModal = ({ order, isOpen, onClose, onSuccess }) => {
    const [isPaid, setIsPaid] = useState(false);
    const [copied, setCopied] = useState(false);

    // Thông tin ngân hàng từ .env (frontend đọc qua REACT_APP_ prefix)
    const bankId = process.env.REACT_APP_BANK_ID || "BIDV";
    const bankAccount = process.env.REACT_APP_BANK_ACCOUNT || "8854192232";
    // ✅ Dùng VA (Tài khoản ảo SePay) để SePay tự động nhận dạng giao dịch
    // VA giúp tránh tình trạng BIDV ghi đè nội dung CK bằng mã tham chiếu của họ
    const bankVA = process.env.REACT_APP_BANK_VA || "96247ORDER";
    const bankName = process.env.REACT_APP_BANK_ACCOUNT_NAME || "AURA CANDLE";

    const orderCode = order?.orderCode || "";
    const amount = order?.totalAmount || 0;

    // Tạo URL QR từ VietQR — dùng VA account thay tài khoản thật
    // Khi quét QR → chuyển vào VA → SePay nhận diện và trigger webhook
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${bankVA}-compact2.png?amount=${amount}&addInfo=${orderCode}&accountName=${encodeURIComponent(bankName)}`;


    // Reset state khi modal mở lại cho đơn hàng mới
    useEffect(() => {
        if (isOpen) {
            setIsPaid(false);
            setCopied(false);
        }
    }, [isOpen, orderCode]);

    // Auto-polling mỗi 3 giây — dừng khi isPaid hoặc modal đóng
    const handlePollSuccess = useCallback(() => {
        setIsPaid(true);
        if (onSuccess) onSuccess();
    }, [onSuccess]);

    useEffect(() => {
        if (!isOpen || isPaid || !orderCode) return;

        const interval = setInterval(async () => {
            try {
                const res = await checkSepayStatus(orderCode);
                if (res?.status === "PAID") {
                    clearInterval(interval);
                    handlePollSuccess();
                }
            } catch (err) {
                // Bỏ qua lỗi mạng — tiếp tục polling
                console.warn("[SePay] Polling error:", err?.message);
            }
        }, 3000);

        // Cleanup: dừng interval khi unmount hoặc dependencies thay đổi
        return () => clearInterval(interval);
    }, [isOpen, isPaid, orderCode, handlePollSuccess]);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(orderCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-emerald-50">
                    <div>
                        <h2 className="text-lg font-bold text-emerald-800">Chuyển khoản ngân hàng</h2>
                        <p className="text-xs text-emerald-600 mt-0.5">Quét mã QR bằng ứng dụng ngân hàng</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isPaid ? (
                        /* ── Trạng thái thành công ── */
                        <div className="py-8 flex flex-col items-center gap-4 text-center">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                                <CheckCircle size={52} className="text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Thanh toán thành công!</h3>
                                <p className="text-gray-500 mt-1 text-sm">
                                    Hệ thống đã xác nhận giao dịch cho đơn hàng{" "}
                                    <span className="font-mono font-bold text-emerald-700">{orderCode}</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* ── Trạng thái chờ thanh toán ── */
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* QR Code */}
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-20" />
                                    <div className="relative bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                                        <img
                                            src={qrUrl}
                                            alt="QR chuyển khoản"
                                            className="w-48 h-48 object-contain rounded-lg"
                                        />
                                    </div>
                                </div>
                                {/* Spinner chờ */}
                                <div className="mt-3 flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span className="text-xs font-semibold">Đang chờ thanh toán...</span>
                                </div>
                            </div>

                            {/* Thông tin chuyển khoản */}
                            <div className="flex-1 flex flex-col gap-3 justify-center">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ngân hàng</p>
                                    <p className="font-semibold text-gray-800">{bankId}</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Số tài khoản</p>
                                    <p className="font-mono font-bold text-gray-800">{bankAccount}</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Số tiền</p>
                                    <p className="font-black text-emerald-600 text-xl">
                                        {amount.toLocaleString("vi-VN")}
                                        <span className="text-sm font-bold text-gray-400 ml-1">đ</span>
                                    </p>
                                </div>

                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Nội dung CK</p>
                                        <button
                                            onClick={handleCopyCode}
                                            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 transition-colors"
                                        >
                                            <Copy size={12} />
                                            {copied ? "Đã copy!" : "Copy"}
                                        </button>
                                    </div>
                                    <p className="font-mono font-black text-emerald-800 text-lg tracking-wider select-all">
                                        {orderCode}
                                    </p>
                                    <p className="text-xs text-red-500 mt-1 font-medium">
                                        ⚠ Ghi đúng nội dung để hệ thống tự xác nhận
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isPaid && (
                    <div className="px-6 pb-5 pt-0">
                        <ul className="text-xs text-gray-400 space-y-1 italic">
                            <li>• Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận trong vài giây.</li>
                            <li>• Không cần đóng cửa sổ này — trang sẽ tự cập nhật.</li>
                        </ul>
                        <button
                            onClick={onClose}
                            className="mt-3 w-full py-2.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SepayQRModal;
