# ❌ Order Cancellation Rules

## 📋 Quy Định Hủy Đơn Hàng

**Nguyên tắc:** Đơn hàng **KHÔNG THỂ HỦY** sau khi đã chuyển sang trạng thái **Shipped** (đang giao hàng).

---

## ✅ Được Phép Hủy

Seller có thể hủy đơn hàng khi status là:

| Status | Description | Cho phép hủy |
|--------|-------------|--------------|
| **Pending** | Chờ xử lý | ✅ Được phép |
| **Confirmed** | Đã xác nhận | ✅ Được phép |

**Lý do:** 
- Đơn hàng chưa được giao cho đơn vị vận chuyển
- Có thể dừng xử lý đơn hàng dễ dàng
- Không ảnh hưởng đến logistics

---

## ❌ KHÔNG Được Phép Hủy

Seller **KHÔNG THỂ** hủy đơn hàng khi status là:

| Status | Description | Lý do không cho hủy |
|--------|-------------|---------------------|
| **Shipped** | Đang giao hàng | ❌ Hàng đã được giao cho shipper |
| **Delivered** | Đã giao hàng | ❌ Khách đã nhận hàng |
| **Completed** | Hoàn thành | ❌ Giao dịch đã hoàn tất |

**Lý do:**
- Hàng đã được giao cho đơn vị vận chuyển
- Không thể thu hồi hàng một cách dễ dàng
- Ảnh hưởng đến trải nghiệm khách hàng
- Tốn chi phí logistics

---

## 🔄 Flow Chart

```
┌─────────────────────────────────────────────┐
│         ORDER LIFECYCLE                      │
└─────────────────────────────────────────────┘

Pending          ✅ Có thể hủy
   ↓
Confirmed        ✅ Có thể hủy
   ↓
Shipped          ❌ KHÔNG thể hủy
   ↓
Delivered        ❌ KHÔNG thể hủy
   ↓
Completed        ❌ KHÔNG thể hủy
```

---

## 💻 Technical Implementation

### Backend Validation

**File:** `orderSelletController.js`

```javascript
// Kiểm tra trước khi cho phép update status
if (status === "Cancelled") {
    const nonCancellableStatuses = ["Shipped", "Delivered", "Completed"];
    
    if (nonCancellableStatuses.includes(order.status)) {
        return res.status(400).json({ 
            error: `Không thể hủy đơn hàng đã ${order.status}. Vui lòng liên hệ hỗ trợ.`,
            currentStatus: order.status
        });
    }
}
```

**Response khi vi phạm:**
```json
{
    "error": "Không thể hủy đơn hàng đã Shipped. Vui lòng liên hệ hỗ trợ.",
    "currentStatus": "Shipped"
}
```

---

### Frontend UI

**File:** `Orders.js` (Seller Panel)

**Features:**
1. ✅ Disable option "Cancelled" trong dropdown
2. ✅ Hiển thị warning message
3. ✅ Show error toast nếu cố force update

**Code:**
```javascript
// Disable "Cancelled" option
{STATUS_OPTIONS.map((s) => {
    const isDisabled = 
        s === "Cancelled" && 
        NON_CANCELLABLE_STATUSES.includes(o.status);
    
    return (
        <option 
            key={s} 
            value={s}
            disabled={isDisabled}
        >
            {s} {isDisabled ? "(không khả dụng)" : ""}
        </option>
    );
})}

// Warning message
{NON_CANCELLABLE_STATUSES.includes(o.status) && (
    <p className="text-xs text-red-600 mt-1">
        ⚠️ Không thể hủy đơn đã {o.status}
    </p>
)}
```

---

## 🎯 User Experience

### Scenario 1: Hủy đơn Pending ✅

```
Seller:
├─ Vào Orders panel
├─ Click "Cập nhật" cho order Pending
├─ Chọn status "Cancelled"
├─ Click "Lưu"
└─ ✅ Success: "Cập nhật trạng thái thành công!"

User:
└─ Nhận notification: "❌ Đơn hàng đã bị hủy"
```

---

### Scenario 2: Cố hủy đơn Shipped ❌

```
Seller:
├─ Vào Orders panel
├─ Click "Cập nhật" cho order Shipped
├─ Thấy option "Cancelled (không khả dụng)"
├─ Thấy warning: "⚠️ Không thể hủy đơn đã Shipped"
└─ ❌ Không thể chọn "Cancelled"

Nếu cố force (via API):
└─ ❌ Error: "Không thể hủy đơn hàng đã Shipped..."
```

---

## 📸 UI Screenshots

### Dropdown - Order Pending
```
┌──────────────────────────────┐
│ [Pending          ▼]         │
│  ├─ Pending                  │
│  ├─ Confirmed                │
│  ├─ Shipped                  │
│  ├─ Delivered                │
│  ├─ Cancelled    ✅          │ ← Có thể chọn
│  ├─ Completed                │
│  └─ Refunded                 │
└──────────────────────────────┘
```

### Dropdown - Order Shipped
```
┌──────────────────────────────┐
│ [Shipped          ▼]         │
│  ├─ Pending                  │
│  ├─ Confirmed                │
│  ├─ Shipped                  │
│  ├─ Delivered                │
│  ├─ Cancelled (không khả dụng) ❌  ← Disabled
│  ├─ Completed                │
│  └─ Refunded                 │
└──────────────────────────────┘
│ ⚠️ Không thể hủy đơn đã Shipped
```

---

## 🛠️ Workarounds (Nếu Thực Sự Cần Hủy)

Nếu **thực sự cần hủy** đơn hàng đã Shipped:

### Option 1: Liên hệ Shipper
```
1. Gọi shipper ngay lập tức
2. Yêu cầu thu hồi hàng
3. Sau khi thu hồi thành công
4. Seller update status: Shipped → Confirmed → Cancelled
```

### Option 2: Refund
```
1. Để đơn hàng tiếp tục
2. Khi user nhận hàng
3. User từ chối nhận
4. Shipper trả hàng về
5. Update status: Delivered → Refunded
```

### Option 3: Admin Override (Cần implement)
```
1. Seller contact admin
2. Admin có quyền override rules
3. Admin update trực tiếp trong database
4. Admin note lý do trong system
```

---

## 🔒 Security & Business Rules

### Why These Rules?

**1. Protect Customer Experience**
- Tránh việc hủy đơn khi khách đang chờ hàng
- Đảm bảo commitment từ seller

**2. Reduce Logistics Costs**
- Tránh phí ship hoàn
- Giảm waste trong vận chuyển

**3. Business Integrity**
- Tăng độ tin cậy của platform
- Khuyến khích seller cẩn thận khi confirm order

**4. Legal Protection**
- Có bằng chứng về quy trình
- Tránh tranh chấp

---

## 📊 Statistics & Monitoring

### Metrics to Track:

```
- Cancellation Rate (Pending): X%
- Cancellation Rate (Confirmed): Y%
- Attempted Cancellation (Shipped): Z cases
- Refund Rate (Delivered): W%
```

### Alerts:

```
⚠️ If attempted cancellation of shipped order > 10/day
   → Notify admin to investigate

⚠️ If cancellation rate > 20%
   → Flag seller for review
```

---

## 🧪 Testing Checklist

### Backend Tests:

- [ ] Try cancel Pending order → ✅ Success
- [ ] Try cancel Confirmed order → ✅ Success
- [ ] Try cancel Shipped order → ❌ Error 400
- [ ] Try cancel Delivered order → ❌ Error 400
- [ ] Try cancel Completed order → ❌ Error 400
- [ ] Error message is clear and helpful

### Frontend Tests:

- [ ] "Cancelled" option enabled for Pending
- [ ] "Cancelled" option enabled for Confirmed
- [ ] "Cancelled" option disabled for Shipped
- [ ] Warning message shows for Shipped
- [ ] Toast error shows when API rejects
- [ ] Dropdown updates correctly

---

## 📝 Future Improvements

### 1. Cancellation Window
```javascript
// Allow cancellation within 30 minutes of Shipped
if (status === "Cancelled") {
    const shippedTime = order.shippedAt;
    const now = new Date();
    const minutesSinceShipped = (now - shippedTime) / 60000;
    
    if (minutesSinceShipped < 30) {
        // Allow cancellation
    } else {
        // Block cancellation
    }
}
```

### 2. Partial Cancellation
```javascript
// Allow cancelling specific items, not entire order
{
    orderId: "xxx",
    cancelledItems: ["item1_id", "item2_id"],
    reason: "Out of stock"
}
```

### 3. Cancellation Reasons
```javascript
// Track why orders are cancelled
{
    status: "Cancelled",
    cancellationReason: "Out of stock" | "Customer request" | "Fraud",
    cancelledBy: "seller" | "customer" | "admin"
}
```

---

## 📞 Support

**If seller needs to cancel shipped order:**
- Contact: admin@auracandle.com
- Phone: 1900-xxxx
- Note: Cần lý do chính đáng

**Common valid reasons:**
- Phát hiện lỗi sản phẩm nghiêm trọng
- Nghi ngờ gian lận
- Yêu cầu khẩn từ khách hàng
- Lỗi hệ thống

---

**Status**: ✅ **IMPLEMENTED**  
**Last Updated**: 29/10/2025  
**Version**: 1.0.0

