# 🚀 Chatbot Quick Start - Test Ngay Trong 5 Phút!

## ⚡ Bước 1: Setup (Chỉ cần làm 1 lần)

### 1.1. Kiểm tra Environment Variables

```bash
cd backend
```

Đảm bảo file `.env` có:
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
MONGODB_URI=mongodb://localhost:27017/aura_candle
```

> ⚠️ **Không có OPENAI_API_KEY?** → Get tại https://platform.openai.com/api-keys

---

### 1.2. Seed Fragrances (Nếu products chưa có mùi hương)

```bash
# Ở folder backend
node scripts/seedFragrances.js
```

**Output mong đợi:**
```
✅ Connected to MongoDB
📦 Found 25 products without fragrances
✅ Updated Nến Lavender Chill 150g: [Lavender, Vanilla]
...
🎉 Successfully updated 25 products!
```

> 💡 **Tip:** Script này chỉ update products chưa có fragrances, safe để chạy nhiều lần!

---

## 🎮 Bước 2: Start & Test

### 2.1. Start Backend

```bash
# Terminal 1
cd backend
npm start
```

Đợi thấy:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

### 2.2. Start Frontend

```bash
# Terminal 2 (new terminal)
cd frontend
npm start
```

Trình duyệt sẽ tự mở `http://localhost:3000`

---

### 2.3. Test Chatbot

1. **Mở Chat Widget**
   - Click vào icon chat (góc phải dưới)
   - Nút tròn màu gradient purple-pink 💬

2. **Test Quick Questions**
   - Bạn sẽ thấy 4 nút gợi ý câu hỏi
   - Click "Có mùi nào thơm nhẹ nhẹ không?"
   - Đợi 2-3 giây...
   - Bot sẽ trả lời với list mùi thật từ database!

3. **Test Fragrances Panel**
   - Sau khi bot reply, scroll xuống
   - Bạn sẽ thấy panel "🌬️ Mùi hương có sẵn"
   - Danh sách mùi thật từ shop!

4. **Test Conversation Memory**
   ```
   Bạn: "Có mùi hoa hồng không?"
   Bot: "Có! Mùi Rose..."
   
   Bạn: "Giá bao nhiêu?"
   Bot: "Nến Rose giá X..." ← Bot nhớ bạn đang hỏi về Rose!
   ```

---

## 🧪 Bước 3: Test Nâng Cao (Optional)

### Chạy Test Script

```bash
# Terminal 3 (backend phải đang chạy)
cd backend
node scripts/testChatbot.js
```

**Script sẽ tự động test:**
- ✅ Hỏi về mùi hương
- ✅ Hỏi về giá
- ✅ Tư vấn quà tặng
- ✅ Conversation memory
- ✅ Hỏi về shop

**Output mẫu:**
```
🧪 Starting Chatbot Tests...

📝 Test 1: Hỏi về mùi hương
------------------------------------------------------------
👤 User: Có mùi nào thơm nhẹ nhẹ không?
🤖 Bot: Shop mình có mấy mùi nhẹ nhàng bạn có thể thích: 
        Lavender (thư giãn), Vanilla (ngọt ngào)...

📊 Shop Context:
   - Fragrances: 18
   - Sample Fragrances: Lavender, Rose, Vanilla, Jasmine...
```

---

## 🎯 Test Cases Phải Thử

### ✅ Test 1: Chatbot biết mùi hương trong shop
```
Bạn: "Shop có mùi gì?"
Bot: → Phải list đúng mùi từ database, KHÔNG bịa!
```

### ✅ Test 2: Chatbot tư vấn thông minh
```
Bạn: "Tặng sinh nhật bạn gái nên chọn gì?"
Bot: → Gợi ý sản phẩm phù hợp (Rose, Peach...)
```

### ✅ Test 3: Conversation memory hoạt động
```
Bạn: "Có mùi lavender không?"
Bot: "Có nha!"
Bạn: "Giá bao nhiêu?" ← Không nói "lavender" nữa
Bot: → Phải hiểu đang hỏi giá lavender
```

### ✅ Test 4: Fragrances panel hiển thị
```
- Chat ít nhất 1 lần
- Scroll xuống
- Phải thấy panel "Mùi hương có sẵn"
- Có ít nhất 1 mùi (nếu DB có products)
```

### ✅ Test 5: Quick questions work
```
- Mở chat lần đầu
- Click nút "Tặng sinh nhật nên chọn gì?"
- Tin nhắn tự động gửi
- Bot reply thông minh
```

---

## 🐛 Troubleshooting

### ❌ "OpenAI API error"
**Nguyên nhân:** Thiếu hoặc sai `OPENAI_API_KEY`

**Fix:**
```bash
# Check .env
cat backend/.env

# Đảm bảo có:
OPENAI_API_KEY=sk-proj-xxxxx  # Key phải bắt đầu sk-
```

---

### ❌ "MongoDB connection error"
**Nguyên nhân:** MongoDB chưa start

**Fix:**
```bash
# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

---

### ❌ "Chatbot trả lời chung chung, không biết sản phẩm"
**Nguyên nhân:** Products chưa có fragrances

**Fix:**
```bash
cd backend
node scripts/seedFragrances.js
```

---

### ❌ "Fragrances panel không hiện"
**Kiểm tra:**
1. Open DevTools (F12)
2. Tab Console
3. Có lỗi gì không?
4. Tab Network → Check response `/chat/` có `shopContext`?

**Debug:**
```javascript
// Thêm log vào ChatWidget.js
console.log('shopContext:', shopContext);
```

---

### ❌ "Quick questions không hiện"
**Nguyên nhân:** Đã chat rồi (chỉ hiện khi messages.length <= 1)

**Fix:**
- Refresh page
- Hoặc đóng/mở lại chat widget

---

## 📊 Expected Results

### Sau khi test thành công:

✅ Chatbot biết chính xác mùi hương trong shop  
✅ Chatbot tư vấn dựa trên data thật  
✅ Conversation memory hoạt động  
✅ Fragrances panel hiển thị đúng  
✅ Quick questions clickable  
✅ UI đẹp, smooth  

---

## 🎨 UI Preview

```
┌─────────────────────────────────────┐
│  🌟 Chuyên gia nến thơm             │
│     Sẵn sàng tư vấn                 │
├─────────────────────────────────────┤
│                                     │
│  🤖 Xin chào! Tôi là chuyên gia    │
│     tư vấn nến thơm 🌸             │
│     Bạn thích mùi hương như thế nào?│
│                         11:30       │
│                                     │
├─────────────────────────────────────┤
│ 💡 Gợi ý câu hỏi:                  │
│ [Có mùi nào thơm nhẹ nhẹ không?]   │
│ [Tặng sinh nhật nên chọn gì?]      │
│ [Nến giá bao nhiêu?]                │
│ [Có mùi hoa hồng không?]            │
├─────────────────────────────────────┤
│ 🌬️ Mùi hương có sẵn:              │
│ [Lavender] [Rose] [Vanilla]        │
│ [Jasmine] [Ocean Breeze] ...       │
├─────────────────────────────────────┤
│ 💬 Nhập tin nhắn...            [📤] │
└─────────────────────────────────────┘
```

---

## ⏱️ Timeline

| Step | Time | Cumulative |
|------|------|------------|
| Setup .env | 1 min | 1 min |
| Seed fragrances | 30 sec | 1.5 min |
| Start backend | 30 sec | 2 min |
| Start frontend | 1 min | 3 min |
| Test chatbot | 2 min | **5 min** |

**Total: ~5 phút** ⚡

---

## 📚 Đọc Thêm

- **Chi tiết kỹ thuật:** `CHATBOT_UPGRADE_GUIDE.md`
- **Tóm tắt thay đổi:** `CHATBOT_SUMMARY.md`
- **Changelog:** `CHATBOT_CHANGELOG.md`
- **Scripts help:** `backend/scripts/README.md`

---

## 🎉 Done!

Chatbot giờ đã **THÔNG MINH** hơn gấp 10 lần!

### Before:
❌ Bịa mùi hương  
❌ Không biết sản phẩm  
❌ Không nhớ context  

### After:
✅ Biết chính xác mùi trong shop  
✅ Tư vấn dựa trên data thật  
✅ Nhớ 6 tin nhắn trước  
✅ UI đẹp, UX tốt  

**Happy Testing! 🚀**

