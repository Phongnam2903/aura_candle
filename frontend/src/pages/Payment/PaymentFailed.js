import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import Layout from '../../layout/Layout';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const errorCode = searchParams.get('code');
  const message = searchParams.get('message');

  const getErrorMessage = () => {
    if (message) return decodeURIComponent(message);
    
    // VNPay error codes
    const vnpayErrors = {
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Lỗi không xác định.'
    };

    return vnpayErrors[errorCode] || 'Thanh toán không thành công. Vui lòng thử lại.';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-16 h-16 text-red-600" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-600">
              {getErrorMessage()}
            </p>
          </div>

          {orderId && (
            <div className="bg-red-50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
              <p className="font-mono font-semibold text-red-700 text-lg">
                {orderId}
              </p>
            </div>
          )}

          {errorCode && (
            <div className="bg-gray-50 rounded-xl p-3 mb-6">
              <p className="text-xs text-gray-500">Mã lỗi: {errorCode}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Thử lại thanh toán
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Bạn cần hỗ trợ? Liên hệ:{' '}
              <a href="mailto:support@auracandle.com" className="text-red-600 hover:underline">
                support@auracandle.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentFailed;

