# Payment Configuration Guide

## Environment Variables

Thêm các biến sau vào file `.env` của bạn:

```env
# VNPay Configuration
# Đăng ký tài khoản sandbox tại: https://sandbox.vnpayment.vn/
VNPAY_TMN_CODE=YOUR_VNPAY_TMN_CODE
VNPAY_HASH_SECRET=YOUR_VNPAY_HASH_SECRET
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5000/payment/vnpay/callback
VNPAY_API=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction

# Momo Configuration
# Đăng ký tài khoản test tại: https://developers.momo.vn/
MOMO_PARTNER_CODE=YOUR_MOMO_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_MOMO_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_MOMO_SECRET_KEY
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_RETURN_URL=http://localhost:5000/payment/momo/return
MOMO_NOTIFY_URL=http://localhost:5000/payment/momo/callback

# Client URL (đã có)
CLIENT_URL=http://localhost:3000
```

## Cách lấy API Keys

### VNPay Sandbox

1. Truy cập: https://sandbox.vnpayment.vn/
2. Đăng ký tài khoản doanh nghiệp test
3. Sau khi duyệt, lấy thông tin:
   - `vnp_TmnCode`: Mã website
   - `vnp_HashSecret`: Chuỗi bí mật

### Momo Test

1. Truy cập: https://developers.momo.vn/
2. Đăng ký tài khoản developer
3. Tạo app mới, lấy thông tin:
   - `partnerCode`
   - `accessKey`
   - `secretKey`

## Payment Flow

### VNPay
```
User -> Frontend -> Backend (/payment/vnpay/create) 
  -> VNPay Payment Gateway -> User pays 
  -> VNPay callback (/payment/vnpay/callback) 
  -> Redirect to Frontend (success/failed page)
```

### Momo
```
User -> Frontend -> Backend (/payment/momo/create) 
  -> Momo Payment Gateway -> User pays 
  -> Momo IPN callback (/payment/momo/callback)
  -> Momo redirects user (/payment/momo/return)
  -> Redirect to Frontend (success/failed page)
```

## API Endpoints

### Create Payment

**VNPay:**
```
POST /payment/vnpay/create
Authorization: Bearer <token>
Body: {
  "orderId": "order_id_here",
  "amount": 100000,
  "orderDescription": "Thanh toán đơn hàng",
  "bankCode": "" // optional
}
```

**Momo:**
```
POST /payment/momo/create
Authorization: Bearer <token>
Body: {
  "orderId": "order_id_here",
  "orderDescription": "Thanh toán đơn hàng"
}
```

### Check Payment Status

```
GET /payment/status/:orderId
Authorization: Bearer <token>
```

## Testing

### VNPay Test Cards
- Card Number: 9704198526191432198
- Card Holder: NGUYEN VAN A
- Expiry: 07/15
- OTP: 123456

### Momo Test
- Sử dụng app Momo test với tài khoản test của bạn
- Hoặc scan QR code để thanh toán

## Production Notes

⚠️ **QUAN TRỌNG:**
1. Thay đổi URLs từ sandbox sang production
2. Cập nhật return URLs với domain thật
3. Bảo mật `SECRET_KEY` và `HASH_SECRET`
4. Enable HTTPS cho production
5. Verify callback signatures cẩn thận

