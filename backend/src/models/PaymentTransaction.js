const mongoose = require('mongoose');

/**
 * Lưu lại từng giao dịch chuyển khoản nhận được từ SePay.
 * Mục đích:
 *  - Chống duplicate (sepay_id unique)
 *  - Audit log toàn bộ giao dịch
 *  - Frontend polling dựa vào order_code + status MATCHED
 */
const paymentTransactionSchema = new mongoose.Schema(
    {
        sepay_id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null
        },
        order_code: {
            type: String,
            default: null,
            index: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        reference_code: {
            type: String,
            default: ''
        },
        raw_content: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['MATCHED', 'UNMATCHED', 'MANUAL_MATCHED'],
            default: 'UNMATCHED'
        },
        transaction_date: {
            type: Date
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema, 'payment_transactions');
