# 🔄 Hướng Dẫn Restart - Dashboard Mới

## ⚡ Làm Theo Thứ Tự Này

### Bước 1: Stop Tất Cả

Trong VS Code/Terminal:
- **Ctrl + C** trong terminal backend (nếu đang chạy)
- **Ctrl + C** trong terminal frontend (nếu đang chạy)

---

### Bước 2: Start Backend

```powershell
# Mở terminal mới hoặc dùng terminal cũ
cd D:\Project\Ecommerce_EXE\Aura_Candle\backend
npm start
```

**Đợi thấy:**
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

### Bước 3: Start Frontend (Terminal Mới)

```powershell
# Mở terminal MỚI (Ctrl + Shift + `)
cd D:\Project\Ecommerce_EXE\Aura_Candle\frontend
npm start
```

**Đợi browser tự mở:** `http://localhost:3000`

---

### Bước 4: Clear Cache & Reload

1. **Ctrl + Shift + R** (hard reload)
2. Hoặc **F12** → Tab Network → Check "Disable cache" → **F5**

---

### Bước 5: Vào Dashboard

Vào: `http://localhost:3000/seller/dashboard`

Hoặc click menu: **Seller** → **Dashboard**

---

## 🎯 Bạn Nên Thấy

### Stats Cards (4 cards)
```
[🛍️ Đơn hàng hôm nay: 15]
[📦 Sản phẩm: 48]
[👥 Khách mới: 8]
[📈 Doanh thu tháng: ₫5,500,000] ← PHẢI CÓ SỐ NÀY!
```

### Charts (2 biểu đồ bars)
```
📈 Doanh thu 7 ngày
24/10 ████████████ 1,200,000đ
25/10 ████████████████ 1,500,000đ
...

📊 Khách hàng mới 7 ngày
24/10 ████████ 3 người
25/10 ████████████ 5 người
...
```

### Table
```
📅 Đơn hàng hôm nay (15)
[Table với mã đơn, tổng tiền, trạng thái...]
```

---

## 🔍 Nếu Vẫn KHÔNG Thấy

### Check 1: Backend Console
Xem console backend có log này không:
```
Lấy tất cả thống kê dashboard: { ok: true, data: {...} }
```

Nếu KHÔNG có → Backend chưa được gọi

### Check 2: Browser Console (F12)
```
1. F12 → Tab Console
2. Xem có error gì không?
3. Tab Network → Refresh page
4. Tìm request "dashboard" 
5. Click vào → Tab Response
6. Xem có "revenueChart" và "customersChart" không?
```

**Nếu CÓ:**
```json
{
  "ok": true,
  "data": {
    "ordersToday": 15,
    "revenueChart": [...],  ← PHẢI CÓ!
    "customersChart": [...] ← PHẢI CÓ!
  }
}
```

**Nếu KHÔNG CÓ → Backend cũ, chưa restart!**

---

## 🚨 Troubleshooting

### Vấn đề 1: "Đang tải dữ liệu..." mãi
**Nguyên nhân:** Backend chưa chạy hoặc lỗi API

**Fix:**
```powershell
# Check backend đang chạy
# Terminal backend phải có:
Server running on port 5000
```

### Vấn đề 2: Chỉ thấy 4 cards, KHÔNG thấy charts
**Nguyên nhân:** Backend cũ (chưa có revenueChart)

**Fix:**
```powershell
# Stop backend (Ctrl+C)
# Start lại
cd D:\Project\Ecommerce_EXE\Aura_Candle\backend
npm start
```

### Vấn đề 3: Charts trống (không có bars)
**Nguyên nhân:** Database chưa có orders

**Bình thường!** Nếu:
- Chưa có đơn hàng → Charts sẽ show "Chưa có dữ liệu"
- Có đơn nhưng chưa "Completed" → Revenue = 0

---

## 📸 Screenshot Test

Sau khi restart, chụp màn hình dashboard gửi cho tôi xem!

Hoặc mô tả:
- ✅ Có 4 cards không?
- ✅ Card "Doanh thu tháng" có số tiền không?
- ✅ Có 2 vùng charts không? (có title "Doanh thu 7 ngày", "Khách hàng mới 7 ngày")
- ✅ Có table "Đơn hàng hôm nay" không?

---

## 🎯 Quick Check

Mở browser console (F12) và chạy:
```javascript
// Paste vào Console tab
console.log('Dashboard stats:', document.querySelector('h1').textContent);
console.log('Cards:', document.querySelectorAll('.text-2xl').length);
```

Nên thấy:
```
Dashboard stats: Chào mừng trở lại, Người bán!
Cards: 4
```


