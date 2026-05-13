import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '../../layout/Layout';
import { useCart } from '../../context/CartContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear cart khi thanh toán thành công
    clearCart();
  }, [clearCart]);

  const handleGoToProfile = () => {
    try {
      const userStr = localStorage.getItem('user');
      console.log("[PaymentSuccess] userStr:", userStr);
      
      if (!userStr || userStr === 'undefined') {
        navigate('/');
        return;
      }

      const user = JSON.parse(userStr);
      if (user?._id) {
        navigate(`/profile/${user._id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("[PaymentSuccess] Error in handleGoToProfile:", err);
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-green-100">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600">
              Đơn hàng của bạn đã được thanh toán và xác nhận thành công.
            </p>
          </div>

          {orderId && (
            <div className="bg-green-50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
              <p className="font-mono font-semibold text-green-700 text-lg">
                {orderId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleGoToProfile}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              Xem đơn hàng của tôi
            </button>
            
            <button
              onClick={() => {
                console.log("[PaymentSuccess] Navigating to home");
                navigate('/');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all active:scale-95"
            >
              Tiếp tục mua sắm
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Chúng tôi sẽ sớm liên hệ để xác nhận và giao hàng cho bạn.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;

