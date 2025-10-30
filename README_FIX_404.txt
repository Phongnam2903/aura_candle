=====================================
  KHẮC PHỤC LỖI 404 - FRONTEND
=====================================

VẤN ĐỀ:
  Frontend gọi: https://aura-candle.onrender.com/blog
  Backend trả về: 404 Not Found

NGUYÊN NHÂN:
  Backend trên Render chưa chạy đúng hoặc thiếu Environment Variables

=====================================
  CÁCH SỬA (5 BƯỚC - 10 PHÚT)
=====================================

BƯỚC 1: PUSH CODE MỚI LÊN GITHUB
--------------------------------
Tôi đã thêm logging vào backend. Bạn cần push:

  cd D:\Project\Ecommerce_EXE\Aura_Candle
  git add .
  git commit -m "fix: Add logging for debugging blog routes"
  git push

→ Render sẽ tự động redeploy (đợi 2-3 phút)


BƯỚC 2: SET ENVIRONMENT VARIABLES TRÊN RENDER
---------------------------------------------
1. Vào https://dashboard.render.com
2. Chọn backend service
3. Vào tab "Environment"
4. Thêm các biến sau (NẾU CHƯA CÓ):

   SECRET_KEY=phong123456789012345678901234567890
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aura-candle
   PORT=5000

5. Click "Save Changes" → Đợi redeploy (2-3 phút)


BƯỚC 3: KIỂM TRA MONGODB NETWORK ACCESS
---------------------------------------
1. Vào https://cloud.mongodb.com
2. Network Access → Add IP Address
3. Chọn: ALLOW ACCESS FROM ANYWHERE
4. IP: 0.0.0.0/0
5. Confirm


BƯỚC 4: KIỂM TRA LOGS TRÊN RENDER
---------------------------------
1. Render Dashboard → Tab "Logs"
2. Tìm các dòng sau:

   ✅ MongoDB connected successfully
   ✅ BlogRoutes loaded
   ✅ All routes registered successfully
   ✅ Server đang chạy...

3. Nếu KHÔNG thấy → Quay lại Bước 2


BƯỚC 5: TEST BACKEND
--------------------
Cách 1: Dùng file test-backend-quick.html
  - Mở file test-backend-quick.html bằng trình duyệt
  - Nhập URL backend của bạn
  - Click "Test All"

Cách 2: Mở trình duyệt, truy cập:
  https://aura-candle.onrender.com/

  Kết quả mong đợi:
  {
    "message": "Aura Candle API is running",
    "routes": ["/product", "/category", ..., "/blog"]
  }

Cách 3: Test endpoint blog:
  https://aura-candle.onrender.com/blog

  Kết quả mong đợi: Mảng blogs (có thể rỗng [])


=====================================
  NẾU VẪN LỖI
=====================================

1. Đọc file: FIX_BACKEND_404.md (hướng dẫn chi tiết)

2. Copy toàn bộ Logs từ Render và gửi cho tôi:
   - Render Dashboard → Logs tab
   - Copy all text
   - Paste vào chat

3. Chạy test script:
   cd backend
   node test-blog-api.js


=====================================
  FILE QUAN TRỌNG
=====================================

✅ FIX_BACKEND_404.md
   → Hướng dẫn chi tiết từng bước

✅ test-backend-quick.html
   → Test backend bằng trình duyệt (DÙNG FILE NÀY!)

✅ backend/test-blog-api.js
   → Test backend bằng Node.js


=====================================
  LƯU Ý
=====================================

⚠️ Render Free Tier: Backend sẽ "ngủ" sau 15 phút không dùng.
   Request đầu tiên sẽ mất 30-60 giây để "wake up".

⚠️ Sau khi thay đổi Environment Variables, phải đợi
   Render redeploy (2-3 phút).

⚠️ MongoDB phải whitelist IP 0.0.0.0/0 thì Render mới
   kết nối được.


Chúc bạn fix thành công! 🎉

