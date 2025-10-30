# 🚨 Error Pages - Hướng Dẫn

## 📋 Tổng Quan

Hệ thống có 2 trang error chính để xử lý các trường hợp lỗi:

---

## 🔐 1. Unauthorized Page (403)

### 📍 Route: `/unauthorized`

### 🎯 Mục đích:
Hiển thị khi người dùng **không có quyền** truy cập vào một trang.

### 📝 Khi nào hiển thị:
- Customer cố gắng truy cập `/seller/*` hoặc `/admin/*`
- Seller cố gắng truy cập `/admin/*`
- Người dùng đã login nhưng role không đủ quyền

### ✨ Tính năng:
- ✅ Hiển thị error code **403**
- ✅ Hiển thị thông tin user hiện tại (nếu đã login)
- ✅ Hiển thị role hiện tại
- ✅ Giải thích về các cấp độ truy cập (Customer, Seller, Admin)
- ✅ Nút "Quay Lại" và "Về Trang Chủ"
- ✅ Tự động redirect về trang phù hợp với role

### 💻 Ví dụ:
```
Customer login → truy cập /seller/dashboard → redirect → /unauthorized
Seller login → truy cập /admin/users → redirect → /unauthorized
```

---

## 🔍 2. Not Found Page (404)

### 📍 Route: `*` (catch-all)

### 🎯 Mục đích:
Hiển thị khi người dùng truy cập vào một **đường dẫn không tồn tại**.

### 📝 Khi nào hiển thị:
- URL không khớp với bất kỳ route nào đã định nghĩa
- Trang đã bị xóa hoặc di chuyển
- User nhập sai URL

### ✨ Tính năng:
- ✅ Hiển thị error code **404**
- ✅ Thông báo thân thiện cho user
- ✅ Nút "Quay Lại" và "Về Trang Chủ"
- ✅ Quick links đến các trang phổ biến (Trang chủ, Sản phẩm, Blog, Về chúng tôi)

### 💻 Ví dụ:
```
Truy cập /abc-xyz → 404 Not Found
Truy cập /product/999999 (không tồn tại) → 404 Not Found
```

---

## 🔄 Flow Diagram

```
User nhập URL
    │
    ├─→ URL hợp lệ?
    │   ├─→ YES → Kiểm tra quyền
    │   │           ├─→ Có quyền → Render trang ✅
    │   │           └─→ Không quyền → 403 Unauthorized 🔐
    │   │
    │   └─→ NO → 404 Not Found 🔍
```

---

## 🎨 Design

### Unauthorized Page (403)
- **Màu chủ đạo**: Đỏ (Red) - biểu thị cấm/không được phép
- **Icon**: 🔒 Lock
- **Style**: Professional, nghiêm túc
- **Gradient**: Red to Dark Red

### Not Found Page (404)
- **Màu chủ đạo**: Xanh/Tím (Blue/Purple) - thân thiện
- **Icon**: 🔍 Search
- **Style**: Friendly, playful
- **Gradient**: Blue to Purple

---

## 📂 File Structure

```
src/
├── pages/
│   └── Error/
│       ├── UnauthorizedPage.js    # 403 - Không có quyền
│       └── NotFoundPage.js        # 404 - Không tìm thấy
├── router/
│   └── AppRoutes.js              # Định nghĩa routes
└── components/
    └── Auth/
        └── ProtectedRoute.js      # Xử lý redirect đến /unauthorized
```

---

## 🚀 Cách Sử Dụng

### 1. Tự động (Recommended)

Hệ thống tự động xử lý:
- `ProtectedRoute` tự động redirect đến `/unauthorized` khi không có quyền
- React Router tự động redirect đến `404` khi URL không tồn tại

### 2. Manual Redirect

Trong component, bạn có thể redirect thủ công:

```javascript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  // Redirect đến 403
  if (!hasPermission) {
    navigate('/unauthorized');
  }

  // Redirect đến 404
  if (!dataFound) {
    navigate('*'); // hoặc navigate('/not-found') nếu bạn thêm route này
  }
}
```

---

## 🛠️ Customization

### Thay đổi màu sắc:

```javascript
// UnauthorizedPage.js - Đổi màu từ Red sang Orange
className="from-red-500 to-red-600"
// Thành
className="from-orange-500 to-orange-600"
```

### Thay đổi thông báo:

```javascript
// UnauthorizedPage.js
<h2>Không Có Quyền Truy Cập</h2>
// Thành
<h2>Oops! Bạn không thể vào đây</h2>
```

### Thêm tính năng:

```javascript
// Thêm report button
<button onClick={handleReport}>
  Báo cáo lỗi
</button>
```

---

## 📊 User Experience

### Unauthorized Page (403)
1. User thấy error code 403
2. Hiển thị role hiện tại để user biết mình là ai
3. Giải thích tại sao không có quyền
4. Cung cấp các options: Quay lại hoặc về trang phù hợp

### Not Found Page (404)
1. User thấy error code 404
2. Thông báo thân thiện
3. Cung cấp quick links đến các trang phổ biến
4. Nút "Quay lại" để quay về trang trước

---

## 🧪 Testing

### Test Unauthorized Page:
1. Login với role **customer**
2. Nhập URL: `http://localhost:3000/seller/dashboard`
3. Kết quả: Hiển thị trang 403 Unauthorized

### Test Not Found Page:
1. Nhập URL không tồn tại: `http://localhost:3000/abc-xyz-123`
2. Kết quả: Hiển thị trang 404 Not Found

---

## ✅ Checklist

- [x] Unauthorized Page (403) hoạt động
- [x] Not Found Page (404) hoạt động
- [x] ProtectedRoute redirect đúng
- [x] UI responsive trên mobile
- [x] Buttons hoạt động (Quay lại, Về trang chủ)
- [x] Quick links hoạt động (404)
- [x] Hiển thị đúng thông tin user (403)

---

## 🐛 Troubleshooting

### Vấn đề: Trang 403 không hiển thị?
**Giải pháp**: Kiểm tra `ProtectedRoute` đã redirect đến `/unauthorized` chưa

### Vấn đề: Trang 404 không hiển thị?
**Giải pháp**: Đảm bảo route `*` ở **cuối cùng** trong AppRoutes

### Vấn đề: Loop redirect vô hạn?
**Giải pháp**: Kiểm tra logic trong `ProtectedRoute`, đảm bảo không redirect về chính nó

---

## 📚 Best Practices

1. ✅ Luôn có trang 403 và 404
2. ✅ Thông báo rõ ràng, dễ hiểu
3. ✅ Cung cấp cách để user quay lại
4. ✅ Design thân thiện, không làm user hoảng sợ
5. ✅ Mobile-friendly
6. ✅ Consistent với design system

---

## 🔜 Future Improvements

- [ ] Thêm trang 500 (Server Error)
- [ ] Log errors cho admin
- [ ] A/B testing messages
- [ ] Analytics tracking cho error pages
- [ ] Multilingual support
- [ ] Custom error pages theo role

---

**Phát triển bởi: Aura Candle Team** 🕯️

**Version**: 1.0.0  
**Last Updated**: 30/10/2025

