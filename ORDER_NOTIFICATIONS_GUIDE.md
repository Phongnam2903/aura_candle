# 🔔 Order Notifications System Guide

## 📋 Tổng Quan

Hệ thống tự động gửi thông báo cho **khách hàng** mỗi khi **seller** cập nhật trạng thái đơn hàng.

---

## ✅ Đã Implement

### 1️⃣ **Clear Cart sau Checkout**

**Before:**
- ❌ COD: Clear cart ✓
- ❌ Bank Transfer: KHÔNG clear cart ✗

**After:**
- ✅ COD: Clear cart + Navigate ngay
- ✅ Bank Transfer: Clear cart + Hiển thị QR 3s + Navigate

**Code:**
```javascript
// Clear cart cho TẤT CẢ phương thức thanh toán
clearCart();

if (payment === "Bank") {
    toast.success("Đơn hàng đã được tạo! Vui lòng quét mã QR để thanh toán.");
    setTimeout(() => navigate("/"), 3000); // User có 3s để xem QR
} else {
    toast.success("Đặt hàng thành công!");
    navigate("/");
}
```

---

### 2️⃣ **Auto Notification khi Update Status**

Khi seller update order status hoặc confirm payment → **Tự động gửi notification cho user**.

---

## 🔔 Notification Flow

### **Trigger Points:**

| Action | Notification |
|--------|-------------|
| Seller confirm payment (unpaid → paid) | 💰 "Thanh toán đã được xác nhận!" |
| Seller update status → Confirmed | ✅ "Đơn hàng đã được xác nhận!" |
| Seller update status → Shipped | 🚚 "Đơn hàng đang được giao!" |
| Seller update status → Delivered | 📦 "Đơn hàng đã được giao!" |
| Seller update status → Completed | 🎉 "Đơn hàng hoàn tất!" |
| Seller update status → Cancelled | ❌ "Đơn hàng đã bị hủy" |
| Seller update status → Refunded | 💸 "Đơn hàng đã hoàn tiền" |

---

## 📨 Notification Messages

### **1. Payment Confirmed**
```
Title: "💰 Thanh toán đã được xác nhận!"
Message: "Đơn hàng ORD-xxx của bạn đã được xác nhận thanh toán. 
          Chúng tôi sẽ xử lý đơn hàng ngay."
Type: Order
```

### **2. Order Confirmed**
```
Title: "✅ Đơn hàng đã được xác nhận!"
Message: "Đơn hàng ORD-xxx đã được xác nhận. 
          Chúng tôi đang chuẩn bị hàng cho bạn."
Type: Order
```

### **3. Order Shipped**
```
Title: "🚚 Đơn hàng đang được giao!"
Message: "Đơn hàng ORD-xxx đã được giao cho đơn vị vận chuyển. 
          Bạn sẽ nhận hàng sớm thôi!"
Type: Order
```

### **4. Order Delivered**
```
Title: "📦 Đơn hàng đã được giao!"
Message: "Đơn hàng ORD-xxx đã được giao đến bạn. 
          Cảm ơn bạn đã mua hàng!"
Type: Order
```

### **5. Order Completed**
```
Title: "🎉 Đơn hàng hoàn tất!"
Message: "Đơn hàng ORD-xxx đã hoàn tất. 
          Cảm ơn bạn! Hãy đánh giá sản phẩm nhé."
Type: Order
```

### **6. Order Cancelled**
```
Title: "❌ Đơn hàng đã bị hủy"
Message: "Đơn hàng ORD-xxx đã bị hủy. 
          Nếu có thắc mắc, vui lòng liên hệ chúng tôi."
Type: Order
```

### **7. Order Refunded**
```
Title: "💸 Đơn hàng đã hoàn tiền"
Message: "Đơn hàng ORD-xxx đã được hoàn tiền. 
          Tiền sẽ về tài khoản trong 3-5 ngày."
Type: Order
```

---

## 🎯 User Experience Flow

### **Scenario 1: COD Order**

```
1. User: Checkout với COD
   └─ Cart cleared ✅
   └─ Navigate to home ✅
   
2. Seller: Confirm Order
   └─ User receives: "✅ Đơn hàng đã được xác nhận!"
   
3. Seller: Ship Order
   └─ User receives: "🚚 Đơn hàng đang được giao!"
   
4. Seller: Mark Delivered
   └─ User receives: "📦 Đơn hàng đã được giao!"
   
5. User: Click notification → View order detail
```

---

### **Scenario 2: Bank Transfer Order**

```
1. User: Checkout với Bank Transfer
   └─ QR code displays ✅
   └─ Cart cleared ✅
   └─ Auto navigate after 3s ✅
   
2. User: Scan QR & Transfer money

3. Seller: Check bank account → Confirm Payment
   └─ User receives: "💰 Thanh toán đã được xác nhận!"
   └─ Order auto update: Pending → Confirmed
   
4. Seller: Ship Order
   └─ User receives: "🚚 Đơn hàng đang được giao!"
   
5. User: Receives package

6. Seller: Mark Delivered
   └─ User receives: "📦 Đơn hàng đã được giao!"
```

---

## 💻 Technical Implementation

### **Backend Changes**

#### File: `OrderSellerController.js`

**Added:**
1. Import Notification model
2. `getNotificationMessage()` helper function
3. Auto create notification after order update

**Code:**
```javascript
// Import
const { Order, Notification } = require("../../models");

// After order.save()
const notificationData = getNotificationMessage(order, paymentStatus, status);

if (notificationData) {
    await Notification.create({
        user: order.user,
        title: notificationData.title,
        message: notificationData.message,
        type: "Order",
        relatedOrder: order._id,
    });
}
```

---

### **Frontend Changes**

#### File: `Checkout.js`

**Before:**
```javascript
if (payment === "Bank") {
    toast.success("...");
    // ❌ Cart NOT cleared
} else {
    toast.success("...");
    clearCart(); // ✅ Only for COD
    navigate("/");
}
```

**After:**
```javascript
// ✅ Clear cart for ALL payment methods
clearCart();

if (payment === "Bank") {
    toast.success("...");
    setTimeout(() => navigate("/"), 3000); // 3s delay
} else {
    toast.success("...");
    navigate("/"); // Immediate
}
```

---

## 🔍 How User Sees Notifications

### **Header Bell Icon**
```
🔔 (3)  ← Unread count badge
```

**Click bell → Dropdown:**
```
╔══════════════════════════════════════╗
║  Thông báo                           ║
╠══════════════════════════════════════╣
║ 💰 Thanh toán đã được xác nhận!      ║
║    Đơn hàng ORD-123... [NEW]         ║
║────────────────────────────────────  ║
║ ✅ Đơn hàng đã được xác nhận!        ║
║    Đơn hàng ORD-456...               ║
║────────────────────────────────────  ║
║ 🚚 Đơn hàng đang được giao!          ║
║    Đơn hàng ORD-789...               ║
╚══════════════════════════════════════╝
   [Xem tất cả thông báo]
```

**Click notification → Navigate to order detail page**

---

## 📊 Database Schema

### **Notification Model**
```javascript
{
    user: ObjectId,              // User nhận notification
    title: String,                // "💰 Thanh toán đã được xác nhận!"
    message: String,              // Chi tiết message
    type: "Order",                // Order/Payment/System/Promotion
    relatedOrder: ObjectId,       // Link to Order
    isRead: Boolean,              // false → unread, true → read
    createdAt: Date,              // Timestamp
    updatedAt: Date
}
```

---

## 🧪 Testing Checklist

### **Test Cart Clearing:**

- [ ] Checkout với COD → Cart cleared ✅
- [ ] Checkout với Bank → Cart cleared ✅
- [ ] Checkout với Bank → QR hiển thị 3s ✅
- [ ] Sau checkout → Navigate to home ✅

### **Test Notifications:**

- [ ] Seller confirm payment → User nhận notif "💰 Thanh toán..." ✅
- [ ] Seller update → Confirmed → User nhận notif "✅ Đơn hàng..." ✅
- [ ] Seller update → Shipped → User nhận notif "🚚 Đơn hàng..." ✅
- [ ] Seller update → Delivered → User nhận notif "📦 Đơn hàng..." ✅
- [ ] Seller update → Completed → User nhận notif "🎉 Đơn hàng..." ✅
- [ ] Seller update → Cancelled → User nhận notif "❌ Đơn hàng..." ✅
- [ ] Notification badge count tăng ✅
- [ ] Click notif → Navigate to order detail ✅
- [ ] Click "Xem tất cả" → Mark all read ✅

---

## 🚀 Future Enhancements (Optional)

### **1. Email Notifications**
```javascript
// Gửi email khi có notification quan trọng
if (status === "Shipped" || paymentStatus === "paid") {
    await sendEmail(
        user.email,
        notificationData.title,
        notificationData.message
    );
}
```

### **2. SMS Notifications**
```javascript
// Gửi SMS cho order shipped/delivered
if (status === "Shipped") {
    await sendSMS(user.phone, notificationData.message);
}
```

### **3. Push Notifications**
```javascript
// Browser push notification
if (Notification.permission === "granted") {
    new Notification(notificationData.title, {
        body: notificationData.message,
        icon: "/logo.png"
    });
}
```

### **4. Real-time Updates (WebSocket)**
```javascript
// Socket.io for real-time notifications
io.to(userId).emit('new-notification', notificationData);
```

---

## 📱 User Actions

### **After Receiving Notification:**

1. **View Notification**
   - Click bell icon → See dropdown
   - Unread notifications highlighted

2. **Read Notification**
   - Click notification → Auto mark as read
   - Navigate to order detail page

3. **Mark All Read**
   - Click "Xem tất cả thông báo"
   - All notifications → isRead: true

4. **View Order Details**
   - From notification → Order detail page
   - See full order info + tracking

---

## 🎨 UI/UX Details

### **Notification Badge Colors:**

| Status | Color | Style |
|--------|-------|-------|
| Unread | Red | bg-red-500 |
| Payment | Green | text with 💰 |
| Confirmed | Blue | text with ✅ |
| Shipped | Purple | text with 🚚 |
| Delivered | Green | text with 📦 |
| Completed | Dark Green | text with 🎉 |
| Cancelled | Red | text with ❌ |
| Refunded | Orange | text with 💸 |

---

## 📝 Notes

- ✅ Notifications được tạo **tự động** khi seller update
- ✅ Không block response nếu notification fail
- ✅ User nhận notif trong **real-time** (khi refresh page)
- ✅ Link trực tiếp đến order detail
- ✅ Support đa ngôn ngữ (có thể mở rộng)

---

**Status**: ✅ **COMPLETED**  
**Last Updated**: $(date)  
**Version**: 1.0.0

