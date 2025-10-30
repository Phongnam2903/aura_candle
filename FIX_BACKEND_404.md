# 🔧 Khắc Phục Lỗi 404 - Backend Trên Render

## ❌ Vấn Đề Hiện Tại
Frontend đang gọi đúng URL: `https://aura-candle.onrender.com/blog`  
Nhưng backend trả về **404 Not Found**

→ **Nguyên nhân**: Backend trên Render chưa deploy đúng hoặc thiếu Environment Variables

---

## ✅ BƯỚC 1: Push Code Mới Lên GitHub (BẮT BUỘC!)

Tôi đã thêm logging vào backend để dễ debug. Bạn cần push code mới:

```bash
cd D:\Project\Ecommerce_EXE\Aura_Candle
git add .
git commit -m "fix: Add logging and 404 handler for debugging blog routes"
git push
```

**Render sẽ tự động redeploy sau khi bạn push!** (Đợi 2-3 phút)

---

## ✅ BƯỚC 2: Kiểm Tra Environment Variables Trên Render

### 2.1 Đăng nhập Render Dashboard
Vào: https://dashboard.render.com

### 2.2 Chọn Backend Service
Tìm service backend (có tên giống `aura-candle` hoặc tên bạn đặt)

### 2.3 Vào Tab "Environment"
Kiểm tra xem có **ĐẦY ĐỦ** các biến sau không:

```bash
SECRET_KEY=phong123456789012345678901234567890
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aura-candle
PORT=5000
```

### ⚠️ LƯU Ý QUAN TRỌNG:
- `SECRET_KEY`: Phải có ít nhất 32 ký tự
- `MONGODB_URI`: Phải lấy từ MongoDB Atlas
- Nếu thiếu bất kỳ biến nào → Backend sẽ crash → Routes không được đăng ký

### 2.4 Nếu Thiếu Biến Môi Trường:
1. Click "Add Environment Variable"
2. Thêm từng biến một
3. Click "Save Changes"
4. Service sẽ tự động redeploy (đợi 2-3 phút)

---

## ✅ BƯỚC 3: Kiểm Tra Logs Trên Render

### 3.1 Vào Tab "Logs"
Trong Render Dashboard → Click tab **Logs**

### 3.2 Tìm Các Dòng Sau (Nếu Thành Công):
```
✅ MongoDB connected successfully
🔑 SECRET_KEY: Loaded OK
✅ BlogRoutes loaded
✅ All routes registered successfully
📥 GET /
✅ Server đang chạy tại http://localhost:10000
```

### 3.3 Nếu Thấy Lỗi:
```
❌ Lỗi: SECRET_KEY không được định nghĩa trong file .env
```
→ Quay lại Bước 2, thêm SECRET_KEY

```
❌ MongoDB connection failed
```
→ Kiểm tra MONGODB_URI và Network Access (Bước 4)

```
Error: Cannot find module '...'
```
→ Dependencies chưa cài đủ, thử Manual Deploy

---

## ✅ BƯỚC 4: Kiểm Tra MongoDB Network Access

### 4.1 Đăng nhập MongoDB Atlas
Vào: https://cloud.mongodb.com

### 4.2 Network Access
- Menu bên trái → **Network Access**
- Click **Add IP Address**

### 4.3 Allow All IPs (Để Render Kết Nối Được)
- Chọn: **ALLOW ACCESS FROM ANYWHERE**
- IP Address: `0.0.0.0/0`
- Click **Confirm**

---

## ✅ BƯỚC 5: Test Backend Sau Khi Deploy

### 5.1 Đợi Render Deploy Xong
Trong tab Logs, thấy: `✅ Server đang chạy tại...`

### 5.2 Test Bằng Trình Duyệt
Mở URL:
```
https://aura-candle.onrender.com/
```

**Kết quả mong đợi:**
```json
{
  "message": "Aura Candle API is running",
  "routes": ["/product", "/category", "/material", "/auth", "/upload", "/cart", "/order", "/orderSeller", "/addresses", "/chat", "/notification", "/comments", "/dashboard", "/payment", "/blog"]
}
```

### 5.3 Test Blog Endpoint
```
https://aura-candle.onrender.com/blog
```

**Kết quả mong đợi:**
- Status 200
- Trả về mảng blogs (có thể rỗng `[]` nếu chưa có blog)

**Nếu vẫn 404:**
→ Logs có dòng `❌ 404 Not Found: GET /blog`
→ Routes chưa được đăng ký → Check lại code trong server.js

---

## ✅ BƯỚC 6: Nếu Vẫn Lỗi - Manual Deploy

### 6.1 Trong Render Dashboard
1. Click tab **Manual Deploy**
2. Click **Clear build cache & deploy**
3. Đợi 3-5 phút

### 6.2 Theo dõi Logs
Xem từng bước build:
```
==> Downloading cache...
==> Installing dependencies...
==> npm install
==> Starting service...
✅ Server đang chạy...
```

---

## ✅ BƯỚC 7: Test Frontend Lại

Sau khi backend chạy OK:

1. Mở trang frontend của bạn (Vercel/Netlify)
2. F12 → Console
3. Thử tạo blog mới
4. Nếu vẫn lỗi, check request URL trong Network tab

---

## 🔍 DEBUG: Xem Request URL Từ Frontend

Mở Console (F12), chạy:
```javascript
console.log("API URL:", process.env.REACT_APP_API_URL);
```

**Nếu hiển thị:**
- `http://localhost:5000` → SAI! Phải set env var trên Vercel/Netlify
- `https://aura-candle.onrender.com` → ĐÚNG!
- `undefined` → Chưa set env var

---

## 📌 Checklist Cuối Cùng

- [ ] Push code mới lên GitHub
- [ ] Backend trên Render có đầy đủ env vars (SECRET_KEY, MONGODB_URI)
- [ ] MongoDB whitelist IP 0.0.0.0/0
- [ ] Render Logs hiển thị "✅ Server đang chạy..."
- [ ] Test `https://aura-candle.onrender.com/` trả về JSON
- [ ] Test `https://aura-candle.onrender.com/blog` trả về 200

---

## 🆘 Nếu Vẫn Không Được

**Copy toàn bộ Logs từ Render** và gửi cho tôi:
1. Render Dashboard → Logs tab
2. Scroll lên đầu
3. Copy tất cả (từ "Starting service..." đến "Server đang chạy...")
4. Paste vào chat

Tôi sẽ giúp bạn debug chi tiết!

