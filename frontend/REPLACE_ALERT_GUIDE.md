# 🚫 Loại Bỏ Alert & Confirm - Hướng Dẫn

## 📋 Tổng Quan

Hướng dẫn thay thế tất cả `alert()` và `confirm()` bằng giải pháp hiện đại hơn.

---

## ❌ Vấn Đề với Alert/Confirm

### **window.alert()**
- ❌ Giao diện xấu, không customizable
- ❌ Block UI thread
- ❌ Không responsive
- ❌ Không có branding
- ❌ Trải nghiệm UX kém

### **window.confirm()**
- ❌ Tương tự alert
- ❌ Chỉ có 2 button: OK/Cancel
- ❌ Không thể custom text, màu sắc
- ❌ Không có icon, animation

---

## ✅ Giải Pháp Thay Thế

### **1. Toast Notifications** (Cho thông báo)
**Thay thế:** `alert()`

**Sử dụng:** `react-toastify` (đã có sẵn)

```javascript
import { toast } from 'react-toastify';

// Thay vì
alert('Lưu thành công!');

// Dùng
toast.success('Lưu thành công!');
toast.error('Có lỗi xảy ra!');
toast.warning('Cảnh báo!');
toast.info('Thông tin!');
```

### **2. Custom Confirm Dialog** (Cho xác nhận)
**Thay thế:** `window.confirm()`

**Sử dụng:** `useConfirm` hook (mới tạo)

```javascript
import { useConfirm } from '../hooks/useConfirm';

function MyComponent() {
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa item này?',
      type: 'danger',
      confirmText: 'Xóa',
      cancelText: 'Hủy'
    });

    if (result) {
      // User clicked Xóa
      deleteItem();
    }
  };

  return (
    <>
      <button onClick={handleDelete}>Xóa</button>
      <ConfirmDialog />
    </>
  );
}
```

---

## 📁 File Đã Tạo

### **1. useConfirm Hook**
**File:** `src/hooks/useConfirm.js`

**Features:**
- ✅ Dialog đẹp với animation
- ✅ 3 types: warning, danger, info
- ✅ Custom text cho buttons
- ✅ Promise-based (async/await support)
- ✅ Responsive
- ✅ Z-index cao (9999)

### **2. CSS Animations**
**File:** `src/index.css` (đã có sẵn)

**Animations:**
- `fadeIn` - Fade in effect
- `slideUp` - Slide up effect

---

## 🔄 Các File Cần Thay Thế

### **Tìm Alert/Confirm:**

Sử dụng search trong VSCode:
- Search: `alert\(`
- Search: `window.confirm\(`
- Search: `confirm\(`

### **Danh Sách Files Thường Có:**

#### **1. Seller Pages**
```
pages/Seller/BlogDetail.js
pages/Seller/EditBlog.js  
pages/Seller/CreateBlog.js
pages/Seller/EditProduct.js
pages/Seller/AddProduct.js
pages/Seller/OrderDetail.js
components/seller/Products.js
components/seller/Materials.js
components/seller/CategoryList.js
```

#### **2. Profile & Auth**
```
components/features/Profile/AddressManager.js
components/features/Profile/ChangePassword.js
components/Auth/RegisterForm.js
components/Auth/ForgotPasswordForm.js
```

#### **3. Cart & Checkout**
```
components/features/Cart/Cart.js
components/features/Cart/Checkout.js
components/Payment/PaymentModal.js
```

---

## 🛠️ Hướng Dẫn Thay Thế

### **Example 1: Alert Thông Báo**

**TRƯỚC (Cũ):**
```javascript
const handleSave = () => {
  saveData();
  alert('Lưu thành công!');
};
```

**SAU (Mới):**
```javascript
import { toast } from 'react-toastify';

const handleSave = () => {
  saveData();
  toast.success('Lưu thành công!', {
    position: 'top-right',
    autoClose: 2000
  });
};
```

---

### **Example 2: Confirm Dialog**

**TRƯỚC (Cũ):**
```javascript
const handleDelete = () => {
  if (window.confirm('Bạn có chắc muốn xóa?')) {
    deleteItem();
  }
};
```

**SAU (Mới):**
```javascript
import { useConfirm } from '../hooks/useConfirm';

function MyComponent() {
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa item này? Hành động này không thể hoàn tác.',
      type: 'danger',
      confirmText: 'Xóa',
      cancelText: 'Hủy'
    });

    if (result) {
      deleteItem();
      toast.success('Đã xóa thành công!');
    }
  };

  return (
    <>
      <button onClick={handleDelete}>Xóa</button>
      <ConfirmDialog />
    </>
  );
}
```

---

### **Example 3: Alert Reset (Development)**

**TRƯỚC (Cũ):**
```javascript
const handleReset = () => {
  localStorage.removeItem('hasVisitedWebsite');
  alert('Reset thành công! Refresh để test lại.');
};
```

**SAU (Mới):**
```javascript
import { toast } from 'react-toastify';

const handleReset = () => {
  localStorage.removeItem('hasVisitedWebsite');
  toast.success('Reset thành công! Refresh để test lại.', {
    autoClose: 3000
  });
};
```

---

### **Example 4: Multiple Confirms**

**TRƯỚC (Cũ):**
```javascript
const handleLogout = () => {
  if (confirm('Bạn muốn đăng xuất?')) {
    logout();
    alert('Đã đăng xuất!');
  }
};
```

**SAU (Mới):**
```javascript
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'react-toastify';

function MyComponent() {
  const { confirm, ConfirmDialog } = useConfirm();

  const handleLogout = async () => {
    const result = await confirm({
      title: 'Đăng xuất',
      message: 'Bạn có chắc muốn đăng xuất?',
      type: 'warning',
      confirmText: 'Đăng xuất',
      cancelText: 'Ở lại'
    });

    if (result) {
      logout();
      toast.success('Đã đăng xuất thành công!');
      navigate('/login');
    }
  };

  return (
    <>
      <button onClick={handleLogout}>Đăng xuất</button>
      <ConfirmDialog />
    </>
  );
}
```

---

## 🎨 Customization

### **Toast Options:**

```javascript
toast.success('Message', {
  position: 'top-right',     // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  autoClose: 2000,           // ms
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
});
```

### **Confirm Dialog Types:**

```javascript
// Warning (Yellow)
confirm({
  type: 'warning',
  title: 'Cảnh báo',
  message: 'Bạn có chắc chắn?'
});

// Danger (Red)
confirm({
  type: 'danger',
  title: 'Nguy hiểm',
  message: 'Hành động này không thể hoàn tác!'
});

// Info (Blue)
confirm({
  type: 'info',
  title: 'Thông tin',
  message: 'Bạn có muốn tiếp tục?'
});
```

---

## 📊 Checklist Thay Thế

### **Seller Pages:**
- [ ] `BlogDetail.js` - Delete confirmation
- [ ] `EditBlog.js` - Save/Delete confirmations
- [ ] `CreateBlog.js` - Save confirmation
- [ ] `EditProduct.js` - Save/Delete confirmations
- [ ] `AddProduct.js` - Save confirmation
- [ ] `Products.js` - Delete confirmation
- [ ] `Materials.js` - Delete confirmation
- [ ] `CategoryList.js` - Delete confirmation
- [ ] `OrderDetail.js` - Status change confirmation

### **Profile & Auth:**
- [ ] `AddressManager.js` - Delete address confirmation
- [ ] `ChangePassword.js` - Success notification
- [ ] `RegisterForm.js` - Success notification
- [ ] `ForgotPasswordForm.js` - Success notification

### **Cart & Checkout:**
- [ ] `Cart.js` - Remove item confirmation
- [ ] `Checkout.js` - Order confirmation
- [ ] `PaymentModal.js` - Payment confirmation

### **Other:**
- [ ] Search toàn bộ project cho `alert(`
- [ ] Search toàn bộ project cho `confirm(`
- [ ] Test tất cả functionalities

---

## 🧪 Testing

### **Test Toast:**
```javascript
// Test trong component
const testToast = () => {
  toast.success('Success!');
  toast.error('Error!');
  toast.warning('Warning!');
  toast.info('Info!');
};
```

### **Test Confirm:**
```javascript
const testConfirm = async () => {
  const result = await confirm({
    title: 'Test',
    message: 'This is a test',
    type: 'warning'
  });
  
  console.log('Result:', result); // true/false
};
```

---

## 🎯 Best Practices

### ✅ **DO's:**
- Dùng `toast` cho thông báo
- Dùng `confirm` cho hành động quan trọng
- Custom message rõ ràng
- Sử dụng type phù hợp (warning/danger/info)
- Test trên nhiều devices

### ❌ **DON'Ts:**
- Không dùng `alert()` nữa
- Không dùng `window.confirm()` nữa
- Không spam quá nhiều toast
- Không dùng confirm cho action nhỏ
- Không quên thêm `<ConfirmDialog />`

---

## 📝 Code Snippets

### **1. Import Templates:**

```javascript
// For toast only
import { toast } from 'react-toastify';

// For confirm dialog
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'react-toastify';
```

### **2. Component Template:**

```javascript
import React from 'react';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'react-toastify';

function MyComponent() {
  const { confirm, ConfirmDialog } = useConfirm();

  const handleAction = async () => {
    const result = await confirm({
      title: 'Confirm Action',
      message: 'Are you sure?',
      type: 'warning'
    });

    if (result) {
      // Do something
      toast.success('Done!');
    }
  };

  return (
    <>
      <button onClick={handleAction}>Action</button>
      <ConfirmDialog />
    </>
  );
}

export default MyComponent;
```

---

## 🔍 Find & Replace Guide

### **VSCode Search:**

1. **Find all alerts:**
   - Regex: `alert\([^)]*\)`
   - Files to include: `src/**/*.js`

2. **Find all confirms:**
   - Regex: `window\.confirm\([^)]*\)|confirm\([^)]*\)`
   - Files to include: `src/**/*.js`

3. **Replace Pattern:**
   ```
   Find: alert\(([^)]+)\)
   Replace: toast.success($1)
   ```

---

## 📚 Additional Resources

### **Toast Documentation:**
- Package: `react-toastify`
- Docs: https://fkhadra.github.io/react-toastify

### **Custom Hook:**
- File: `src/hooks/useConfirm.js`
- Usage: See examples above

---

## ✅ Summary

**Removed:**
- ❌ `alert()`
- ❌ `window.confirm()`

**Replaced With:**
- ✅ `toast` (react-toastify)
- ✅ `useConfirm` hook

**Benefits:**
- ✨ Better UX
- ✨ Modern UI
- ✨ Customizable
- ✨ Responsive
- ✨ Branding consistency

---

**Happy coding!** 🎉

