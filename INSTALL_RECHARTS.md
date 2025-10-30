# Cài đặt Recharts cho Dashboard

## Bước 1: Cài đặt thư viện

Mở terminal và chạy lệnh sau:

```bash
cd D:\Project\Ecommerce_EXE\Aura_Candle\frontend
npm install recharts
```

## Bước 2: Restart Frontend

Sau khi cài xong, restart lại frontend server:

1. Dừng server hiện tại (Ctrl + C)
2. Chạy lại: `npm start`

## Bước 3: Test Dashboard

1. Đăng nhập với tài khoản seller
2. Vào Dashboard → Xem biểu đồ đẹp!

## ✨ Tính năng mới:

✅ **Biểu đồ doanh thu** - Area Chart với gradient màu xanh  
✅ **Biểu đồ khách hàng** - Line Chart với dots  
✅ **Cards thống kê** - Hiển thị số liệu với animation  
✅ **Bảng đơn hàng hôm nay** - Danh sách 5 đơn hàng mới nhất  
✅ **Responsive** - Tối ưu cho mọi màn hình  
✅ **Tooltips** - Hiển thị chi tiết khi hover  

## 🎨 Design:

- Gradient background: Gray → Blue
- Smooth animations với Framer Motion
- Professional charts với Recharts
- Clean & Modern UI

---

**File đã tạo:**
- `frontend/src/components/seller/DashboardWithCharts.js` (Dashboard mới)
- `frontend/src/router/SellerRoutes.js` (Đã update)

