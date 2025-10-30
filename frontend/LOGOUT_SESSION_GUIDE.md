# 🚪 Logout & Session Management Guide

## 📋 Tổng Quan

Hướng dẫn quản lý logout và session trong ứng dụng để đảm bảo clear data đúng cách.

---

## ✅ Cách Logout Đúng

### **1. Sử dụng `logout()` từ AuthContext**

**ĐÚNG** ✅:
```javascript
import { useAuth } from '../../context/AuthContext';

function MyComponent() {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout(); // Clear state + localStorage
    navigate('/login');
  };
}
```

**SAI** ❌:
```javascript
// KHÔNG làm thế này!
const handleLogout = () => {
  localStorage.clear(); // ❌ Xóa TẤT CẢ data (kể cả cart, settings...)
  navigate('/login');
};

// hoặc
const handleLogout = () => {
  localStorage.removeItem('token'); // ❌ Chỉ xóa token, còn user & role
  navigate('/login');
};
```

---

## 🔧 Đã Sửa

### **Before (Có Bug)** ❌

**File**: `src/components/seller/SellerSidebar.js`
```javascript
const handleLogout = () => {
  localStorage.clear(); // ❌ Bug: Xóa tất cả localStorage
  navigate("/login");
};
```

**Vấn đề:**
1. ❌ State trong AuthContext không được clear
2. ❌ Xóa hết localStorage (kể cả giỏ hàng, settings...)
3. ❌ User vẫn còn trong memory (AuthContext)

### **After (Fixed)** ✅

**File**: `src/components/seller/SellerSidebar.js`
```javascript
import { useAuth } from "../../context/AuthContext";

const { logout } = useAuth();

const handleLogout = () => {
  logout(); // ✅ Clear đúng cách
  navigate("/login");
};
```

**Lợi ích:**
1. ✅ Clear state trong AuthContext
2. ✅ Chỉ xóa auth data (token, role, user)
3. ✅ Giữ nguyên data khác (cart, settings...)
4. ✅ Console log để debug

---

## 📦 AuthContext `logout()` Function

**File**: `src/context/AuthContext.js`

```javascript
const logout = () => {
    // 1. Clear AuthContext state
    setUser(null);
    setToken(null);
    setRole(null);
    
    // 2. Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    
    // 3. Log để debug
    console.log('✅ Logout successful - All auth data cleared');
};
```

### **Data được Clear:**
- ✅ `user` state
- ✅ `token` state
- ✅ `role` state
- ✅ `localStorage.token`
- ✅ `localStorage.role`
- ✅ `localStorage.user`

### **Data KHÔNG bị Clear:**
- ✅ Cart data (giỏ hàng)
- ✅ User preferences (settings)
- ✅ Theme settings
- ✅ Language settings
- ✅ Other app data

---

## 🔍 Các Nơi Sử dụng Logout

### ✅ **1. SellerSidebar**
```javascript
// src/components/seller/SellerSidebar.js
const { logout } = useAuth();
const handleLogout = () => {
  logout();
  navigate("/login");
};
```

### ✅ **2. Header**
```javascript
// src/components/homePage/Header.js
const { logout } = useAuth();
const handleLogout = () => {
  logout();
  navigate("/");
};
```

### ✅ **3. RoleInfoBanner**
```javascript
// src/components/Auth/RoleInfoBanner.js
const { logout } = useAuth();
const handleLogout = () => {
  logout();
  navigate('/');
};
```

---

## 🧪 Cách Test Logout

### **Manual Test:**

1. **Login với Seller**
   ```
   - Login → Vào /seller/dashboard
   - Mở Console (F12)
   - Click "Đăng xuất"
   - Kiểm tra console có log "✅ Logout successful"
   ```

2. **Kiểm tra localStorage**
   ```
   - Mở DevTools → Application → Local Storage
   - Trước logout: Có token, role, user
   - Sau logout: KHÔNG có token, role, user
   ```

3. **Kiểm tra redirect**
   ```
   - Sau logout → redirect đúng (login hoặc home)
   - Vào lại /seller/dashboard → redirect về /login
   ```

### **Code Test:**

```javascript
// Sử dụng auth helpers
import { verifyLogoutClean, debugAuthState } from '../utils/authHelpers';

// Trước logout
debugAuthState();
// Output:
// 🔐 Auth State Debug
//   Token: ✅ Exists
//   Role: seller
//   User: {name: "Seller 1", ...}

// Sau logout
logout();
verifyLogoutClean();
// Output:
// ✅ Logout verification: All auth data cleared
```

---

## 🐛 Debug Logout Issues

### **Vấn đề 1: User vẫn login sau khi logout**

**Nguyên nhân:**
- Không dùng `logout()` từ AuthContext
- Chỉ clear localStorage mà không clear state

**Giải pháp:**
```javascript
// Thay vì:
localStorage.clear();

// Dùng:
const { logout } = useAuth();
logout();
```

### **Vấn đề 2: Giỏ hàng bị mất sau logout**

**Nguyên nhân:**
- Dùng `localStorage.clear()` thay vì `logout()`

**Giải pháp:**
- Sử dụng `logout()` từ AuthContext (chỉ xóa auth data)

### **Vấn đề 3: Token vẫn còn trong localStorage**

**Nguyên nhân:**
- Implement logout sai, chưa removeItem

**Giải pháp:**
- Check implementation của `logout()` trong AuthContext

---

## 📝 Checklist Khi Implement Logout

- [ ] Import `useAuth` từ AuthContext
- [ ] Destructure `logout` function
- [ ] Gọi `logout()` trước khi navigate
- [ ] Không dùng `localStorage.clear()`
- [ ] Không dùng `localStorage.removeItem()` trực tiếp
- [ ] Test logout bằng console log
- [ ] Verify localStorage đã clear
- [ ] Test redirect sau logout

---

## 🔐 Security Best Practices

1. **Luôn clear tất cả auth data khi logout**
   - Token, role, user

2. **Không lưu sensitive data trong localStorage**
   - Chỉ lưu token (JWT)
   - Backend validate token

3. **Token expiration**
   - Set expiration time cho token
   - Auto logout khi token hết hạn

4. **Secure routes**
   - Dùng ProtectedRoute
   - Backend validate mọi request

---

## 📚 Utils Available

### **Auth Helpers** (`src/utils/authHelpers.js`)

```javascript
import {
  isUserLoggedIn,      // Check user đã login chưa
  getCurrentUser,       // Lấy user object
  getCurrentUserRole,   // Lấy role
  hasRole,             // Check role cụ thể
  debugAuthState,      // Debug auth state
  verifyLogoutClean    // Verify logout đã clear hết chưa
} from '../utils/authHelpers';
```

---

## 🎯 Summary

### ✅ **DO's**
- Dùng `logout()` từ AuthContext
- Clear cả state VÀ localStorage
- Test logout thoroughly
- Log để debug

### ❌ **DON'Ts**
- Dùng `localStorage.clear()`
- Chỉ clear localStorage mà không clear state
- Quên redirect sau logout
- Không test logout

---

**Status**: ✅ **FIXED & VERIFIED**

**Files Updated**:
- `src/components/seller/SellerSidebar.js` - Fixed logout
- `src/context/AuthContext.js` - Enhanced logout function
- `src/utils/authHelpers.js` - New utility functions

---

**Phát triển bởi: Aura Candle Team** 🕯️

