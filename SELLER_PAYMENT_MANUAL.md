# 💰 Hướng Dẫn Xác Nhận Thanh Toán Cho Seller

## 📋 Quy Trình Xác Nhận Thanh Toán Manual

### 🎯 Tổng Quan

Với phương thức **Chuyển khoản ngân hàng**, seller cần xác nhận thanh toán thủ công khi nhận được tiền trong tài khoản ngân hàng.

---

## 🔄 Workflow Đầy Đủ

### 1️⃣ **Khách hàng đặt hàng**

```
Khách hàng:
├─ Thêm sản phẩm vào giỏ hàng
├─ Vào Checkout
├─ Chọn phương thức: 🏦 "Chuyển khoản ngân hàng"
├─ Xác nhận đặt hàng
└─ Hiển thị QR code với nội dung: "Thanh toán đơn hàng #ORDER_CODE"
```

**Trạng thái order sau khi tạo:**
- `status`: "Pending"
- `paymentStatus`: "unpaid"
- `paymentMethod`: "Bank"

---

### 2️⃣ **Khách hàng chuyển khoản**

```
Khách hàng:
├─ Mở app ngân hàng
├─ Quét QR code HOẶC chuyển khoản thủ công
├─ Nội dung CK: "Thanh toán đơn hàng #ORD-1234567890"
└─ Hoàn tất chuyển khoản
```

**📌 Quan trọng:** Nội dung chuyển khoản phải có **Order Code** để seller dễ đối chiếu!

---

### 3️⃣ **Seller kiểm tra & xác nhận thanh toán**

#### Bước 1: Vào Seller Panel → Orders

```
Dashboard → Quản lý đơn hàng
```

#### Bước 2: Filter đơn hàng chưa thanh toán

Click button: **🔴 Chưa thanh toán**

→ Hiển thị tất cả orders với:
- `paymentStatus`: "unpaid"
- `paymentMethod`: "Bank"
- Background đỏ nhạt (highlight)

#### Bước 3: Kiểm tra tài khoản ngân hàng

```
✅ Mở app/internet banking
✅ Check lịch sử giao dịch
✅ Tìm giao dịch với nội dung: "Thanh toán đơn hàng #ORD-xxx"
✅ Verify số tiền khớp với totalAmount
```

#### Bước 4: Xác nhận thanh toán

Nếu đã nhận được tiền:

```
1. Click button "💵 Xác nhận TT" (Xác nhận Thanh Toán)
2. Confirm dialog: "Xác nhận đã nhận được thanh toán?"
3. Click "OK"
```

**Kết quả:**
- `paymentStatus`: "unpaid" → "paid" ✅
- `status`: "Pending" → "Confirmed" ✅
- Order tự động chuyển sang tab "Đã thanh toán"
- Toast notification: "Đã xác nhận thanh toán!"

---

## 📊 Seller Panel - Giao Diện Orders

### Filter Options

| Button | Hiển thị | Số lượng |
|--------|----------|----------|
| **Tất cả** | Tất cả orders | (10) |
| **🔴 Chưa thanh toán** | paymentStatus = "unpaid" | (3) |
| **✅ Đã thanh toán** | paymentStatus = "paid" | (7) |

### Table Columns

| Column | Thông tin |
|--------|-----------|
| **Mã đơn hàng** | `orderCode` + Ngày tạo |
| **Khách hàng** | Tên + Email |
| **Thanh toán** | Icon + Method + Payment Status Badge |
| **Tổng tiền** | `totalAmount` (VNĐ) |
| **Trạng thái đơn** | `status` Badge |
| **Thao tác** | Buttons: Xác nhận TT + Cập nhật |

### Payment Status Badges

- 🔴 **Chưa thanh toán** (`unpaid`) - Đỏ
- ✅ **Đã thanh toán** (`paid`) - Xanh lá
- 🟡 **Đang xử lý** (`processing`) - Vàng
- ⚫ **Thất bại** (`failed`) - Xám
- 🟣 **Đã hoàn tiền** (`refunded`) - Tím

### Order Status Badges

- 🟡 **Pending** - Chờ xử lý
- 🔵 **Confirmed** - Đã xác nhận
- 🟣 **Shipped** - Đã giao vận
- 🟢 **Delivered** - Đã giao
- ✅ **Completed** - Hoàn thành
- 🔴 **Cancelled** - Đã hủy
- ⚫ **Refunded** - Đã hoàn

---

## 🎯 Các Trường Hợp Xử Lý

### Case 1: Thanh toán bình thường ✅
```
User đặt hàng → CK thành công → Seller verify → Confirm
Status: Pending → Confirmed
Payment: unpaid → paid
```

### Case 2: Thanh toán COD 💵
```
User chọn COD → Đặt hàng thành công
→ KHÔNG CẦN confirm payment
→ Thu tiền khi giao hàng
```

### Case 3: Chưa nhận được tiền ⏳
```
User báo đã CK nhưng seller chưa thấy tiền
→ KHÔNG click "Xác nhận TT"
→ Yêu cầu user chụp màn hình giao dịch
→ Verify rồi mới confirm
```

### Case 4: Số tiền không khớp ❌
```
User CK 150k nhưng order là 200k
→ KHÔNG confirm
→ Liên hệ user để CK bù thiếu
→ Hoặc refund + tạo order mới
```

### Case 5: Sai nội dung chuyển khoản 🔍
```
User CK nhưng không ghi Order Code
→ Check theo số tiền + thời gian + tên
→ Liên hệ user để confirm
→ Sau đó mới verify
```

---

## 🚨 Lưu Ý Quan Trọng

### ✅ DO - Nên làm

1. **Kiểm tra kỹ trước khi confirm:**
   - ✅ Số tiền khớp 100%
   - ✅ Nội dung CK có Order Code
   - ✅ Thời gian CK hợp lý (sau khi order tạo)

2. **Xử lý đúng flow:**
   - ✅ Confirm payment → Status tự động "Confirmed"
   - ✅ Update status theo tiến độ: Confirmed → Shipped → Delivered
   - ✅ Mark "Completed" khi khách đã nhận hàng

3. **Communication:**
   - ✅ Thông báo cho khách khi confirm payment
   - ✅ Update status kịp thời
   - ✅ Phản hồi nhanh nếu có vấn đề

### ❌ DON'T - Không nên làm

1. **Confirm khi chưa chắc chắn:**
   - ❌ Chưa thấy tiền trong tài khoản
   - ❌ Số tiền không khớp
   - ❌ Nghi ngờ gian lận

2. **Xử lý sai:**
   - ❌ Confirm payment cho order COD
   - ❌ Bỏ qua việc verify Order Code
   - ❌ Không update status tiếp theo

---

## 📞 FAQ - Câu Hỏi Thường Gặp

### Q1: Làm sao biết order nào cần verify?

**A:** Click button **"🔴 Chưa thanh toán"** trong Orders → Chỉ hiển thị orders cần verify.

Orders với background đỏ nhạt = Chưa thanh toán + Bank Transfer.

---

### Q2: Nếu confirm nhầm thì sao?

**A:** Hiện tại chưa có nút "Revert". Cần:
1. Liên hệ admin/dev để update lại database
2. Hoặc refund lại tiền cho khách
3. **⚠️ Luôn check kỹ trước khi confirm!**

---

### Q3: COD có cần confirm payment không?

**A:** **KHÔNG**. COD = Cash on Delivery:
- Không cần confirm payment
- Thu tiền khi giao hàng
- Update status bình thường

---

### Q4: Nếu user chuyển khoản nhưng không đúng số tiền?

**A:** 
1. KHÔNG confirm
2. Liên hệ user:
   - Nếu thiếu: yêu cầu CK bù
   - Nếu thừa: refund lại hoặc note
3. Chỉ confirm khi số tiền đã đủ

---

### Q5: Làm sao match order khi user không ghi Order Code?

**A:**
1. Check theo **số tiền** + **thời gian**
2. Liên hệ user để xác nhận
3. Check tên người chuyển khoản vs tên khách
4. Sau khi chắc chắn mới confirm

---

## 🎓 Best Practices

### 1. Check thường xuyên
- Vào Orders ít nhất **2 lần/ngày**
- Buổi sáng: 9-10h
- Buổi chiều: 3-4h

### 2. Process nhanh
- Confirm payment trong **30 phút - 2 giờ** sau khi nhận tiền
- Update status khi có tiến độ
- Giao hàng trong 24h sau khi confirm

### 3. Organize tốt
- Filter đúng tab khi làm việc
- Prioritize: Chưa thanh toán → Confirmed → Shipped
- Note lại các case đặc biệt

### 4. Customer Service
- Thông báo cho khách khi confirm payment
- Update tracking info khi ship
- Follow up sau khi delivered

---

## 📱 Mobile Tips

Nếu seller dùng mobile:
1. Bật notification cho email ngân hàng
2. Check Orders panel trên mobile browser
3. Có thể approve payment ngay trên điện thoại
4. Recommend: Dùng laptop cho việc quản lý

---

## ✅ Checklist Hàng Ngày

```
□ Check "Chưa thanh toán" tab
□ Verify giao dịch ngân hàng
□ Confirm payments đã nhận
□ Update status orders đang process
□ Reply messages/comments từ khách
□ Check inventory (tồn kho)
```

---

**Last Updated**: $(date)  
**Version**: 1.0.0  
**Support**: Liên hệ admin nếu có vấn đề kỹ thuật

