// const PaymentService = require('../../services/paymentService');
// const { Payment, Order } = require('../../models');
// const mongoose = require('mongoose');

// // Tạo thanh toán VNPay

// // Helper function để xác thực đơn hàng trước khi thanh toán
// const validateOrderForPayment = async (orderId, amount, userId) => {
//     if (!orderId || !amount) {
//         return { success: false, status: 400, message: 'Thiếu thông tin orderId hoặc amount' };
//     }

//     const order = await Order.findById(orderId).populate('user');
//     if (!order) {
//         return { success: false, status: 404, message: 'Không tìm thấy đơn hàng' };
//     }

//     if (order.user._id.toString() !== userId) {
//         return { success: false, status: 403, message: 'Bạn không có quyền thanh toán đơn hàng này' };
//     }

//     // Có thể thêm kiểm tra:
//     // if (order.totalAmount !== amount) {
//     //     return { success: false, status: 400, message: 'Số tiền thanh toán không khớp với tổng giá trị đơn hàng' };
//     // }
//     // if (order.paymentStatus === 'paid') {
//     //     return { success: false, status: 400, message: 'Đơn hàng này đã được thanh toán' };
//     // }

//     return { success: true, order };
// };

// const createVNPayPayment = async (req, res) => {
//     try {
//         const { orderId, amount, description } = req.body;
//         const userId = req.user?.id;

//         const validation = await validateOrderForPayment(orderId, amount, userId);
//         if (!validation.success) return res.status(validation.status).json({ success: false, message: validation.message });


//         // Tạo payment record
//         const payment = new Payment({
//             order: orderId,
//             method: 'VNPay',
//             amount: amount,
//             status: 'Pending',
//             transactionId: `VNPAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//         });
//         await payment.save();

//         // Tạo VNPay payment URL
//         const paymentResult = await PaymentService.createVNPayPayment({
//             orderId: orderId,
//             amount: amount,
//             orderDescription: description || `Thanh toán đơn hàng ${orderId}`,
//             orderType: 'other'
//         });

//         if (paymentResult.success) {
//             // Tạo QR Code
//             const qrCode = await PaymentService.generateQRCode(paymentResult.paymentUrl);
            
//             res.json({
//                 success: true,
//                 paymentUrl: paymentResult.paymentUrl,
//                 qrCode: qrCode,
//                 paymentId: payment._id,
//                 orderId: orderId
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: 'Không thể tạo thanh toán VNPay',
//                 error: paymentResult.error
//             });
//         }
//     } catch (error) {
//         console.error('Create VNPay payment error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi server khi tạo thanh toán VNPay',
//             error: error.message
//         });
//     }
// };

// // Tạo thanh toán Momo
// const createMomoPayment = async (req, res) => {
//     try {
//         const { orderId, amount, description } = req.body;
//         const userId = req.user?.id;

//         if (!orderId || !amount) {
//             return res.status(400).json({ 
//                 success: false, message: 'Thiếu thông tin orderId hoặc amount' 
//             });
//         }

//         const validation = await validateOrderForPayment(orderId, amount, userId);
//         if (!validation.success) return res.status(validation.status).json({ success: false, message: validation.message });

//         // Tạo payment record
//         const payment = new Payment({
//             order: orderId,
//             method: 'Momo',
//             amount: amount,
//             status: 'Pending',
//             transactionId: `MOMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//         });
//         await payment.save();

//         // Tạo Momo payment
//         const paymentResult = await PaymentService.createMomoPayment({
//             orderId: orderId,
//             amount: amount,
//             orderDescription: description || `Thanh toán đơn hàng ${orderId}`,
//             orderType: 'momo_wallet'
//         });

//         if (paymentResult.success) {
//             // Tạo QR Code từ Momo QR URL hoặc payment URL
//             const qrCode = await PaymentService.generateQRCode(
//                 paymentResult.qrCode || paymentResult.paymentUrl
//             );
            
//             res.json({
//                 success: true,
//                 paymentUrl: paymentResult.paymentUrl,
//                 qrCode: qrCode,
//                 momoQRCode: paymentResult.qrCode,
//                 paymentId: payment._id,
//                 orderId: orderId
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: 'Không thể tạo thanh toán Momo',
//                 error: paymentResult.error
//             });
//         }
//     } catch (error) {
//         console.error('Create Momo payment error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi server khi tạo thanh toán Momo',
//             error: error.message
//         });
//     }
// };

// // Xử lý VNPay callback
// const handleVNPayCallback = async (req, res) => {
//     try {
//         const vnp_Params = req.query;
//         const isValid = PaymentService.verifyVNPayCallback(vnp_Params);

//         if (!isValid) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Chữ ký không hợp lệ'
//             });
//         }

//         const orderId = vnp_Params['vnp_TxnRef'];
//         const responseCode = vnp_Params['vnp_ResponseCode'];
//         const transactionId = vnp_Params['vnp_TransactionNo'];

//         // Tìm payment record
//         const payment = await Payment.findOne({ 
//             order: orderId, 
//             method: 'VNPay' 
//         });

//         if (!payment) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Không tìm thấy payment record'
//             });
//         }

//         if (responseCode === '00') {
//             // Thanh toán thành công
//             payment.status = 'Success';
//             payment.transactionId = transactionId;
//             payment.paidAt = new Date();
//             await payment.save();

//             // Cập nhật order status
//             const order = await Order.findById(orderId);
//             if (order) {
//                 order.paymentStatus = 'paid';
//                 await order.save();
//             }

//             res.json({
//                 success: true,
//                 message: 'Thanh toán thành công',
//                 orderId: orderId,
//                 transactionId: transactionId
//             });
//         } else {
//             // Thanh toán thất bại
//             payment.status = 'Failed';
//             await payment.save();

//             res.json({
//                 success: false,
//                 message: 'Thanh toán thất bại',
//                 orderId: orderId
//             });
//         }
//     } catch (error) {
//         console.error('VNPay callback error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi xử lý callback VNPay',
//             error: error.message
//         });
//     }
// };

// // Xử lý Momo callback
// const handleMomoCallback = async (req, res) => {
//     try {
//         const params = req.body;
//         const isValid = PaymentService.verifyMomoCallback(params);

//         if (!isValid) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Chữ ký không hợp lệ'
//             });
//         }

//         const { orderId, resultCode, transId, amount } = params;

//         // Tìm payment record
//         const payment = await Payment.findOne({ 
//             order: orderId, 
//             method: 'Momo' 
//         });

//         if (!payment) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Không tìm thấy payment record'
//             });
//         }

//         if (resultCode === 0) {
//             // Thanh toán thành công
//             payment.status = 'Success';
//             payment.transactionId = transId;
//             payment.paidAt = new Date();
//             await payment.save();

//             // Cập nhật order status
//             const order = await Order.findById(orderId);
//             if (order) {
//                 order.paymentStatus = 'paid';
//                 await order.save();
//             }

//             res.json({
//                 success: true,
//                 message: 'Thanh toán thành công',
//                 orderId: orderId,
//                 transactionId: transId
//             });
//         } else {
//             // Thanh toán thất bại
//             payment.status = 'Failed';
//             await payment.save();

//             res.json({
//                 success: false,
//                 message: 'Thanh toán thất bại',
//                 orderId: orderId
//             });
//         }
//     } catch (error) {
//         console.error('Momo callback error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi xử lý callback Momo',
//             error: error.message
//         });
//     }
// };

// // Kiểm tra trạng thái thanh toán
// const checkPaymentStatus = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const userId = req.user?.id;

//         const order = await Order.findById(orderId).populate('user');
//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Không tìm thấy đơn hàng'
//             });
//         }

//         // Kiểm tra quyền sở hữu
//         if (order.user._id.toString() !== userId) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Bạn không có quyền xem đơn hàng này'
//             });
//         }

//         const payment = await Payment.findOne({ order: orderId });
        
//         res.json({
//             success: true,
//             paymentStatus: payment ? payment.status : 'Pending',
//             orderStatus: order.status,
//             paymentMethod: order.paymentMethod,
//             totalAmount: order.totalAmount,
//             payment: payment
//         });
//     } catch (error) {
//         console.error('Check payment status error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi kiểm tra trạng thái thanh toán',
//             error: error.message
//         });
//     }
// };

// module.exports = {
//     createVNPayPayment,
//     createMomoPayment,
//     handleVNPayCallback,
//     handleMomoCallback,
//     checkPaymentStatus
// };
