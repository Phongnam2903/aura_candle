const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const paymentController = require('../controllers/PaymentController/paymentController');

// Tạo thanh toán VNPay
router.post('/vnpay/create', verifyToken, paymentController.createVNPayPayment);

// Tạo thanh toán Momo
router.post('/momo/create', verifyToken, paymentController.createMomoPayment);

// Xử lý VNPay callback (không cần auth vì từ VNPay server)
router.get('/vnpay/callback', paymentController.handleVNPayCallback);

// Xử lý Momo callback (IPN - không cần auth)
router.post('/momo/callback', paymentController.handleMomoCallback);

// Xử lý Momo return (redirect user về)
router.get('/momo/return', paymentController.handleMomoReturn);

// Kiểm tra trạng thái thanh toán
router.get('/status/:orderId', verifyToken, paymentController.checkPaymentStatus);

module.exports = router;
