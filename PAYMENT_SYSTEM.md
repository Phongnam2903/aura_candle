# 💳 Payment System - Aura Candle

## 📋 Tổng quan

Hệ thống thanh toán đã được tích hợp hoàn chỉnh với các phương thức:
- ✅ **COD** (Cash on Delivery) - Thanh toán khi nhận hàng
- ✅ **Bank Transfer** - Chuyển khoản ngân hàng qua QR code
- ✅ **VNPay** - Thanh toán qua VNPay (ATM/Visa/MasterCard/QR)
- ✅ **Momo** - Thanh toán qua ví điện tử Momo

---

## 🏗️ Kiến trúc

### Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── PaymentController/
│   │       └── paymentController.js       # Payment logic
│   ├── routes/
│   │   └── PaymentRoutes.js               # Payment endpoints
│   ├── services/
│   │   └── paymentService.js              # VNPay & Momo integration
│   └── models/
│       └── Order.js                        # Updated với payment fields
└── PAYMENT_CONFIG.md                      # Configuration guide
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── payment/
│   │       └── paymentApi.js              # Payment API calls
│   ├── components/
│   │   └── Payment/
│   │       └── PaymentModal.js            # Payment modal UI
│   ├── pages/
│   │   ├── Payment/
│   │   │   ├── PaymentSuccess.js         # Success page
│   │   │   └── PaymentFailed.js          # Failed page
│   │   └── Cart/
│   │       └── CheckoutScreen.js          # Integrated payment
│   └── router/
│       └── AppRoutes.js                   # Payment routes
```

---

## 🔄 Payment Flow

### 1. COD (Cash on Delivery)
```
User chọn COD → Tạo order → Thanh toán khi nhận hàng
```

### 2. Bank Transfer
```
User chọn Bank → Tạo order → Hiển thị QR code → User chuyển khoản → Seller xác nhận
```

### 3. VNPay
```
User chọn VNPay 
  → Frontend gọi /payment/vnpay/create
  → Backend tạo payment URL
  → User được redirect tới VNPay
  → User thanh toán
  → VNPay callback /payment/vnpay/callback
  → Update order status
  → Redirect user về /payment/success hoặc /payment/failed
```

### 4. Momo
```
User chọn Momo 
  → Frontend gọi /payment/momo/create
  → Backend tạo payment URL & QR code
  → User được redirect tới Momo hoặc scan QR
  → User thanh toán
  → Momo IPN callback /payment/momo/callback
  → Momo redirect /payment/momo/return
  → Update order status
  → Redirect user về /payment/success hoặc /payment/failed
```

---

## 🚀 Setup Instructions

### Backend Setup

1. **Cài đặt dependencies** (đã có trong package.json):
```bash
cd backend
npm install
```

2. **Cấu hình .env**:
```env
# VNPay (Sandbox)
VNPAY_TMN_CODE=YOUR_TMN_CODE
VNPAY_HASH_SECRET=YOUR_HASH_SECRET
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5000/payment/vnpay/callback

# Momo (Test)
MOMO_PARTNER_CODE=YOUR_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_SECRET_KEY
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_RETURN_URL=http://localhost:5000/payment/momo/return
MOMO_NOTIFY_URL=http://localhost:5000/payment/momo/callback

# Client URL
CLIENT_URL=http://localhost:3000
```

3. **Đăng ký tài khoản sandbox**:
   - **VNPay**: https://sandbox.vnpayment.vn/
   - **Momo**: https://developers.momo.vn/

### Frontend Setup

Không cần config thêm, đã tích hợp sẵn!

---

## 📡 API Endpoints

### 1. Create VNPay Payment
```http
POST /payment/vnpay/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id_here",
  "amount": 100000,
  "orderDescription": "Thanh toán đơn hàng",
  "bankCode": "" // optional
}

Response:
{
  "ok": true,
  "message": "Tạo link thanh toán thành công",
  "paymentUrl": "https://sandbox.vnpayment.vn/...",
  "orderId": "order_id"
}
```

### 2. Create Momo Payment
```http
POST /payment/momo/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id_here",
  "orderDescription": "Thanh toán đơn hàng"
}

Response:
{
  "ok": true,
  "message": "Tạo link thanh toán Momo thành công",
  "paymentUrl": "https://test-payment.momo.vn/...",
  "qrCode": "https://...",
  "orderId": "order_id"
}
```

### 3. Check Payment Status
```http
GET /payment/status/:orderId
Authorization: Bearer <token>

Response:
{
  "ok": true,
  "paymentStatus": "paid", // unpaid | paid | failed | processing | refunded
  "orderStatus": "Confirmed",
  "totalAmount": 100000
}
```

### 4. VNPay Callback (Internal)
```http
GET /payment/vnpay/callback?vnp_TxnRef=...&vnp_ResponseCode=00&...
```

### 5. Momo Callback (Internal)
```http
POST /payment/momo/callback
Content-Type: application/json

{
  "partnerCode": "...",
  "orderId": "...",
  "resultCode": 0,
  ...
}
```

---

## 🧪 Testing

### Test Cards (VNPay Sandbox)
```
Card Number: 9704198526191432198
Card Holder: NGUYEN VAN A
Expiry Date: 07/15
OTP: 123456
```

### Test Flow
1. Tạo đơn hàng từ checkout
2. Chọn phương thức thanh toán (VNPay/Momo)
3. Click "Xác nhận đặt hàng"
4. Modal hiển thị → Click vào link thanh toán
5. Hoàn tất thanh toán trên gateway
6. Kiểm tra redirect về success/failed page
7. Verify order status trong database

---

## 🔐 Security Notes

### ✅ Implemented
- JWT authentication cho create payment endpoints
- Signature verification cho callbacks
- HTTPS required cho production
- Input validation

### ⚠️ Recommendations for Production
1. **Environment Variables**: Bảo mật tất cả API keys
2. **HTTPS**: Bắt buộc cho production
3. **Webhook URLs**: Phải public và accessible từ VNPay/Momo servers
4. **Rate Limiting**: Implement rate limiting cho payment endpoints
5. **Logging**: Log tất cả payment transactions
6. **Monitoring**: Setup alerts cho failed payments

---

## 📊 Payment Status Flow

```
Order Created
    ↓
paymentStatus: "unpaid"
    ↓
User initiates payment
    ↓
paymentStatus: "processing"
    ↓
Payment Gateway Response
    ↓
Success? → paymentStatus: "paid" + orderStatus: "Confirmed"
Failed? → paymentStatus: "failed"
```

---

## 🐛 Troubleshooting

### Payment URL không tạo được
- Kiểm tra `.env` đã có đầy đủ credentials chưa
- Verify API keys từ VNPay/Momo dashboard
- Check server logs cho error details

### Callback không hoạt động
- Callback URLs phải public (không localhost cho production)
- Sử dụng ngrok cho local testing: `ngrok http 5000`
- Update VNPAY_RETURN_URL và MOMO_NOTIFY_URL với ngrok URL

### Signature mismatch
- Verify HASH_SECRET và SECRET_KEY chính xác
- Check URL encoding của parameters
- VNPay yêu cầu SHA512, Momo yêu cầu SHA256

### Payment status không update
- Check callback endpoint có được gọi không (check logs)
- Verify signature verification logic
- Check database connection

---

## 📞 Support

### VNPay Support
- Docs: https://sandbox.vnpayment.vn/apis/docs/
- Email: support@vnpay.vn

### Momo Support
- Docs: https://developers.momo.vn/v3/
- Email: developer@momo.vn

---

## 🎯 Next Steps

### Enhancements
- [ ] Email notifications sau khi thanh toán thành công
- [ ] SMS notifications
- [ ] Refund functionality
- [ ] Payment history trong profile
- [ ] Invoice PDF generation
- [ ] Multi-currency support
- [ ] Recurring payments (subscriptions)

### Production Checklist
- [ ] Thay sandbox credentials bằng production
- [ ] Update URLs từ localhost sang production domain
- [ ] Enable HTTPS
- [ ] Setup monitoring & alerting
- [ ] Load testing
- [ ] Security audit
- [ ] Compliance check (PCI DSS if storing card data)

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Status**: ✅ Production Ready (with sandbox credentials)

