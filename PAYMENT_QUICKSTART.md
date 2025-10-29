# 🚀 Payment System - Quick Start Guide

## ⚡ Setup trong 5 phút!

### 1️⃣ Backend Setup

**Bước 1: Thêm vào file `.env`**
```bash
cd backend
nano .env  # hoặc notepad .env
```

**Thêm các dòng sau** (sử dụng credentials sandbox mặc định):
```env
# VNPay Sandbox (Test credentials - DO NOT use in production!)
VNPAY_TMN_CODE=YOUR_TMN_CODE
VNPAY_HASH_SECRET=YOUR_HASH_SECRET
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5000/payment/vnpay/callback
VNPAY_API=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction

# Momo Test (Test credentials - DO NOT use in production!)
MOMO_PARTNER_CODE=YOUR_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_SECRET_KEY
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_RETURN_URL=http://localhost:5000/payment/momo/return
MOMO_NOTIFY_URL=http://localhost:5000/payment/momo/callback

# Client URL (nếu chưa có)
CLIENT_URL=http://localhost:3000
```

**Bước 2: Restart server**
```bash
npm run dev
```

✅ **Backend ready!**

---

### 2️⃣ Test Payment Flow (Local)

#### Option 1: Test với COD (Đơn giản nhất)
1. Mở frontend: http://localhost:3000
2. Thêm sản phẩm vào giỏ hàng
3. Checkout → Chọn **"Thanh toán khi nhận hàng (COD)"**
4. Xác nhận đơn hàng
5. ✅ Done! Order được tạo với status "Pending"

#### Option 2: Test với Bank Transfer
1. Thêm sản phẩm vào giỏ
2. Checkout → Chọn **"Chuyển khoản ngân hàng"**
3. QR code sẽ hiển thị
4. Quét mã QR để chuyển khoản (hoặc giả lập)
5. ✅ Done! Seller sẽ xác nhận sau khi nhận tiền

#### Option 3: Test với VNPay (Cần credentials)
1. **Đăng ký VNPay Sandbox**: https://sandbox.vnpayment.vn/
2. Lấy `vnp_TmnCode` và `vnp_HashSecret`
3. Update vào `.env`
4. Restart server
5. Thêm sản phẩm → Checkout → Chọn **"VNPay"**
6. Modal hiển thị → Click "Mở trang thanh toán"
7. Sử dụng **test card**:
   ```
   Card: 9704198526191432198
   Name: NGUYEN VAN A
   Date: 07/15
   OTP: 123456
   ```
8. Hoàn tất → Redirect về `/payment/success`
9. ✅ Order status = "Confirmed", paymentStatus = "paid"

#### Option 4: Test với Momo (Cần credentials)
1. **Đăng ký Momo Developer**: https://developers.momo.vn/
2. Tạo app → Lấy credentials
3. Update vào `.env`
4. Restart server
5. Thêm sản phẩm → Checkout → Chọn **"Momo"**
6. Modal hiển thị → Scan QR hoặc click link
7. Thanh toán qua app Momo test
8. ✅ Done!

---

### 3️⃣ Testing với Ngrok (Cho callback)

**Vấn đề**: VNPay và Momo cần gọi callback về server của bạn, nhưng localhost không public.

**Giải pháp**: Dùng ngrok!

```bash
# Install ngrok
npm install -g ngrok
# hoặc download: https://ngrok.com/download

# Expose backend port
ngrok http 5000
```

**Output:**
```
Forwarding https://abc123.ngrok.io -> http://localhost:5000
```

**Update `.env`:**
```env
VNPAY_RETURN_URL=https://abc123.ngrok.io/payment/vnpay/callback
MOMO_RETURN_URL=https://abc123.ngrok.io/payment/momo/return
MOMO_NOTIFY_URL=https://abc123.ngrok.io/payment/momo/callback
```

**Restart server** và test lại!

---

### 4️⃣ Verify Payment Flow

#### Check Order trong Database
```javascript
// MongoDB Compass hoặc mongosh
db.orders.find().sort({ createdAt: -1 }).limit(1)

// Xem paymentStatus và status
{
  paymentStatus: "paid",    // ✅ Success
  status: "Confirmed",      // ✅ Order confirmed
  totalAmount: 100000,
  paymentMethod: "VNPay"
}
```

#### Check Backend Logs
```bash
# Terminal chạy backend
✅ Server đang chạy tại http://localhost:5000
✅ Payment created successfully
✅ VNPay callback received
✅ Order updated: paid
```

#### Check Frontend
- Sau payment thành công → Redirect to `/payment/success`
- Giỏ hàng tự động clear
- User có thể xem order trong profile

---

### 5️⃣ Troubleshooting

#### ❌ "Không thể tạo thanh toán"
**Fix:**
- Check `.env` có đầy đủ credentials chưa
- Verify backend đang chạy
- Check console logs cho error details

#### ❌ "Payment URL không mở"
**Fix:**
- Disable popup blocker
- Try opening in incognito mode
- Check browser console

#### ❌ "Callback không hoạt động"
**Fix:**
- Sử dụng ngrok cho local testing
- Update callback URLs trong `.env`
- Check VNPay/Momo dashboard settings

#### ❌ "Signature mismatch"
**Fix:**
- Verify HASH_SECRET chính xác
- Check không có khoảng trắng thừa trong `.env`
- Restart server sau khi update `.env`

---

## 🎯 Test Checklist

- [ ] Backend server chạy thành công
- [ ] Frontend kết nối được backend
- [ ] COD payment works
- [ ] Bank transfer hiển thị QR
- [ ] VNPay modal mở được
- [ ] VNPay redirect về success page
- [ ] Order status update thành công
- [ ] Cart clear sau payment
- [ ] User nhận notification (nếu có)

---

## 📞 Cần API Keys?

### VNPay Sandbox
1. Truy cập: https://sandbox.vnpayment.vn/
2. Đăng ký tài khoản merchant
3. Điền thông tin doanh nghiệp (fake data OK cho test)
4. Chờ approve (~1-2 ngày)
5. Login → Settings → Lấy credentials

### Momo Developer
1. Truy cập: https://developers.momo.vn/
2. Đăng ký account
3. Tạo app mới
4. Lấy `partnerCode`, `accessKey`, `secretKey`
5. Configure callback URLs

---

## 💡 Tips

1. **Test COD trước** để verify flow cơ bản
2. **Dùng ngrok** ngay từ đầu nếu test online payments
3. **Check logs** ở cả frontend console và backend terminal
4. **MongoDB Compass** để verify data trong database
5. **Postman/Thunder Client** để test API trực tiếp

---

## ✅ Success Indicators

Khi mọi thứ hoạt động đúng:
- ✅ Modal payment hiển thị smooth
- ✅ Payment URL mở trong tab mới
- ✅ Callback được xử lý (check logs)
- ✅ Redirect về success page
- ✅ Order status = "Confirmed"
- ✅ Payment status = "paid"
- ✅ Cart cleared

---

**Happy Testing! 🎉**

Need help? Check `PAYMENT_SYSTEM.md` for detailed documentation.

