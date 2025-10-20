import React, { useState, useEffect } from 'react';
import { X, Smartphone, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, orderId, amount, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    if (isOpen) {
      setSelectedMethod('');
      setQrCode('');
      setPaymentUrl('');
      setPaymentStatus('pending');
    }
  }, [isOpen]);

  const handlePaymentMethod = async (method) => {
    setLoading(true);
    setSelectedMethod(method);

    try {
      const response = await fetch(`/api/payment/${method.toLowerCase()}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId,
          amount,
          description: `Thanh toán đơn hàng ${orderId}`
        })
      });

      const data = await response.json();

      if (data.success) {
        setQrCode(data.qrCode);
        setPaymentUrl(data.paymentUrl);

        // Mở payment URL trong tab mới
        if (data.paymentUrl) {
          window.open(data.paymentUrl, '_blank');
        }

        // Bắt đầu kiểm tra trạng thái thanh toán
        checkPaymentStatus();
      } else {
        toast.error(data.message || 'Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      toast.error('Lỗi khi tạo thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payment/status/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        if (data.paymentStatus === 'Success') {
          setPaymentStatus('success');
          toast.success('Thanh toán thành công!');
          onPaymentSuccess();
          setTimeout(() => onClose(), 2000);
        } else if (data.paymentStatus === 'Failed') {
          setPaymentStatus('failed');
          toast.error('Thanh toán thất bại');
        } else {
          // Tiếp tục kiểm tra sau 3 giây
          setTimeout(checkPaymentStatus, 3000);
        }
      }
    } catch (error) {
      console.error('Check payment status error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Thanh toán đơn hàng</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-bold text-lg text-green-600">
                {amount.toLocaleString()}₫
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          {!selectedMethod && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 mb-4">Chọn phương thức thanh toán</h3>

              <button
                onClick={() => handlePaymentMethod('VNPay')}
                disabled={loading}
                className="w-full flex items-center justify-between p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">VNPay</span>
                </div>
                <span className="text-sm text-gray-500">Thẻ ATM/Visa</span>
              </button>

              <button
                onClick={() => handlePaymentMethod('Momo')}
                disabled={loading}
                className="w-full flex items-center justify-between p-4 border-2 border-pink-200 rounded-xl hover:border-pink-400 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-pink-600" />
                  <span className="font-medium">Momo</span>
                </div>
                <span className="text-sm text-gray-500">Ví điện tử</span>
              </button>
            </div>
          )}

          {/* QR Code Display */}
          {selectedMethod && qrCode && (
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-4">
                Quét mã QR để thanh toán
              </h3>

              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block mb-4">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Sử dụng ứng dụng {selectedMethod === 'VNPay' ? 'VNPay' : 'Momo'} để quét mã QR
              </p>

              <button
                onClick={() => window.open(paymentUrl, '_blank')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mở trang thanh toán
              </button>
            </div>
          )}

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Thanh toán thành công!
              </h3>
              <p className="text-gray-600">
                Đơn hàng của bạn đã được thanh toán thành công.
              </p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-8">
              <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Thanh toán thất bại
              </h3>
              <p className="text-gray-600 mb-4">
                Có lỗi xảy ra trong quá trình thanh toán.
              </p>
              <button
                onClick={() => {
                  setSelectedMethod('');
                  setQrCode('');
                  setPaymentUrl('');
                  setPaymentStatus('pending');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tạo thanh toán...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

