const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const paymentController = require('../controllers/PaymentController/paymentController');
const sepayController = require('../controllers/PaymentController/sepayController');

// // ──── VNPay ────────────────────────────────────────────────────────────────
// router.post('/vnpay/create', verifyToken, paymentController.createVNPayPayment);
// router.get('/vnpay/callback', paymentController.handleVNPayCallback);

// // ──── Momo ─────────────────────────────────────────────────────────────────
// router.post('/momo/create', verifyToken, paymentController.createMomoPayment);
// router.post('/momo/callback', paymentController.handleMomoCallback);
// router.get('/momo/return', paymentController.handleMomoReturn);

// ──── SePay (Chuyển khoản VietQR) ─────────────────────────────────────────
// Webhook: SePay server gọi vào đây khi có tiền về — không cần auth token
// Bảo mật bằng header: Authorization: Apikey {SEPAY_WEBHOOK_SECRET}
router.post('/sepay/webhook', sepayController.handleSepayWebhook);

// Polling: Frontend hỏi mỗi 3 giây xem tiền về chưa
router.get('/sepay/check-status/:orderCode', verifyToken, sepayController.checkSepayStatus);

// ──── General ──────────────────────────────────────────────────────────────
router.get('/status/:orderId', verifyToken, paymentController.checkPaymentStatus);

module.exports = router;

