# 🎉 First Visit Redirect - Hướng Dẫn

## 📋 Tổng Quan

Tính năng tự động redirect người dùng lần đầu tiên vào website đến trang **About** để giới thiệu về shop.

---

## 🚀 Cách Hoạt Động

### **Flow:**
```
1. User mở website lần đầu → Vào "/" (home)
2. FirstVisitRedirect check localStorage
3. Nếu chưa visit → Redirect về "/about"
4. Set flag "hasVisitedWebsite" = true
5. Lần sau vào → Vào home bình thường
```

### **Diagram:**
```
User vào website
    │
    ├─→ Lần đầu?
    │   ├─→ YES → Redirect /about ✨
    │   │         Set flag visited
    │   │
    │   └─→ NO → Vào home bình thường ✅
```

---

## 📁 Files

### **1. FirstVisitRedirect Component**
**File:** `src/components/Welcome/FirstVisitRedirect.js`

```javascript
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FirstVisitRedirect() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedWebsite');
        
        if (!hasVisited && location.pathname === '/' && location.pathname !== '/about') {
            localStorage.setItem('hasVisitedWebsite', 'true');
            navigate('/about', { replace: true });
        }
    }, [navigate, location]);

    return null;
}
```

### **2. App.js Integration**
```javascript
import FirstVisitRedirect from "./components/Welcome/FirstVisitRedirect";

function AppContent() {
  return (
    <>
      <FirstVisitRedirect />  {/* Thêm component này */}
      <ToastContainer />
      <AppRoutes />
    </>
  );
}
```

---

## ⚙️ Cấu Hình

### **Thay đổi trang redirect:**

Thay vì `/about`, redirect đến trang khác:

```javascript
// FirstVisitRedirect.js
navigate('/welcome', { replace: true });  // Trang welcome
navigate('/intro', { replace: true });    // Trang intro
navigate('/promotions', { replace: true }); // Trang khuyến mãi
```

### **Thay đổi điều kiện:**

**Redirect từ bất kỳ trang nào:**
```javascript
if (!hasVisited && location.pathname !== '/about') {
    // Redirect từ mọi trang, không chỉ home
}
```

**Redirect cho cả subdirectory:**
```javascript
if (!hasVisited && !location.pathname.startsWith('/seller') && !location.pathname.startsWith('/admin')) {
    // Không redirect nếu đang vào seller/admin
}
```

---

## 🎨 Custom Welcome Page

### **Option 1: Modal Welcome**

Tạo component modal thay vì redirect:

```javascript
// src/components/Welcome/WelcomeModal.js
import { useState, useEffect } from 'react';

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedWebsite');
        if (!hasVisited) {
            setIsOpen(true);
            localStorage.setItem('hasVisitedWebsite', 'true');
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md">
                <h2 className="text-3xl font-bold mb-4">Chào mừng đến Aura Candle! 🕯️</h2>
                <p className="text-gray-600 mb-6">
                    Khám phá bộ sưu tập nến thơm cao cấp của chúng tôi...
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-6 py-3 bg-gray-200 rounded-lg"
                    >
                        Đóng
                    </button>
                    <a 
                        href="/about"
                        className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg text-center"
                    >
                        Tìm hiểu thêm
                    </a>
                </div>
            </div>
        </div>
    );
}
```

### **Option 2: Splash Screen**

```javascript
// src/components/Welcome/SplashScreen.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedWebsite');
        if (!hasVisited) {
            setShow(true);
            localStorage.setItem('hasVisitedWebsite', 'true');
            
            // Auto redirect sau 3 giây
            setTimeout(() => {
                navigate('/about');
            }, 3000);
        }
    }, [navigate]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center z-50">
            <div className="text-center text-white">
                <h1 className="text-6xl font-bold mb-4">Aura Candle 🕯️</h1>
                <p className="text-2xl">Chào mừng bạn đến với thế giới nến thơm</p>
                <div className="mt-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                </div>
            </div>
        </div>
    );
}
```

---

## 🔧 Testing

### **Test First Visit:**
1. Mở Developer Tools (F12)
2. Application → Local Storage
3. Xóa key `hasVisitedWebsite`
4. Refresh page
5. Kết quả: Redirect về `/about` ✅

### **Test Returning User:**
1. Vào website lần đầu (redirect về /about)
2. Quay lại home
3. Refresh page
4. Kết quả: Vẫn ở home, không redirect ✅

### **Console Testing:**
```javascript
// Test trong console

// Xóa flag để test lại first visit
localStorage.removeItem('hasVisitedWebsite');

// Check xem đã visit chưa
localStorage.getItem('hasVisitedWebsite'); // null = chưa, "true" = rồi
```

---

## 🛠️ Utilities

### **Reset First Visit (For Development)**

Tạo button để reset:

```javascript
// Trong About page hoặc Settings
function ResetFirstVisit() {
    const handleReset = () => {
        localStorage.removeItem('hasVisitedWebsite');
        alert('Reset thành công! Refresh để test lại.');
    };

    return (
        <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded">
            🔄 Reset First Visit (Dev Only)
        </button>
    );
}
```

### **Check Status**

```javascript
// Component để hiển thị status
function FirstVisitStatus() {
    const hasVisited = localStorage.getItem('hasVisitedWebsite');
    
    return (
        <div className="p-4 bg-gray-100 rounded">
            Status: {hasVisited ? '✅ Returning User' : '🆕 First Time Visitor'}
        </div>
    );
}
```

---

## 📊 Analytics Integration

Nếu muốn track first visit với Google Analytics:

```javascript
useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedWebsite');
    
    if (!hasVisited) {
        // Track first visit
        if (window.gtag) {
            window.gtag('event', 'first_visit', {
                event_category: 'engagement',
                event_label: 'First Time User'
            });
        }
        
        localStorage.setItem('hasVisitedWebsite', 'true');
        navigate('/about', { replace: true });
    }
}, [navigate]);
```

---

## 🎯 Best Practices

### ✅ **DO's:**
- Set flag sau khi redirect
- Sử dụng `replace: true` để không thêm vào history
- Check pathname để tránh loop
- Test trên nhiều trình duyệt

### ❌ **DON'Ts:**
- Không redirect liên tục (gây annoying)
- Không redirect seller/admin
- Không dùng cookies (localStorage đơn giản hơn)
- Không redirect khi user đã login

---

## 🔒 Privacy

### **Theo dõi gì?**
- ✅ Chỉ lưu flag `hasVisitedWebsite = true`
- ✅ Không lưu thông tin cá nhân
- ✅ Không track hành vi

### **User có thể xóa:**
- ✅ Clear localStorage → Reset first visit
- ✅ Clear browser data → Reset tất cả

---

## 🐛 Troubleshooting

### **Vấn đề: Luôn redirect về /about**
**Nguyên nhân:** Flag không được set
**Giải pháp:** Check console errors, verify localStorage

### **Vấn đề: Không redirect**
**Nguyên nhân:** Flag đã được set
**Giải pháp:** Xóa `hasVisitedWebsite` trong localStorage

### **Vấn đề: Redirect loop**
**Nguyên nhân:** Điều kiện check sai
**Giải pháp:** Thêm check `location.pathname !== '/about'`

---

## 📚 Extensions

### **Redirect dựa trên nguồn traffic:**

```javascript
useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedWebsite');
    const referrer = document.referrer;
    
    if (!hasVisited) {
        localStorage.setItem('hasVisitedWebsite', 'true');
        
        // Redirect khác nhau theo nguồn
        if (referrer.includes('google')) {
            navigate('/about');
        } else if (referrer.includes('facebook')) {
            navigate('/promotions');
        } else {
            navigate('/about');
        }
    }
}, [navigate]);
```

### **Time-based redirect:**

```javascript
useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisitTime');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    if (!lastVisit || (now - lastVisit) > oneWeek) {
        // Redirect nếu chưa visit hoặc > 1 tuần
        localStorage.setItem('lastVisitTime', now);
        navigate('/about');
    }
}, [navigate]);
```

---

## 📝 Summary

**Current Setup:**
- ✅ Redirect người dùng mới đến `/about`
- ✅ Chỉ redirect lần đầu
- ✅ Lưu flag trong localStorage
- ✅ Không làm phiền returning users

**Files Created:**
1. `src/components/Welcome/FirstVisitRedirect.js`
2. `FIRST_VISIT_GUIDE.md`

**Files Modified:**
1. `src/App.js` - Added `<FirstVisitRedirect />`

---

**Phát triển bởi: Aura Candle Team** 🕯️

