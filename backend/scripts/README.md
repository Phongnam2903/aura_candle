# 🛠️ Scripts Utilities

Các script hỗ trợ cho Aura Candle backend.

---

## 📋 Danh Sách Scripts

### 1. `seedFragrances.js`
**Mục đích:** Seed fragrances (mùi hương) vào products nếu chưa có

**Khi nào dùng:**
- Lần đầu setup chatbot
- Products trong DB chưa có fragrances
- Muốn random assign mùi cho products test

**Cách chạy:**
```bash
cd backend
node scripts/seedFragrances.js
```

**Output mẫu:**
```
✅ Connected to MongoDB
📦 Found 25 products without fragrances
✅ Updated Nến Lavender Chill 150g: [Lavender, Vanilla]
✅ Updated Nến Rose Garden 200g: [Rose, Jasmine, Sandalwood]
...
🎉 Successfully updated 25 products!
```

**Lưu ý:**
- Script chỉ update products chưa có fragrances
- Mỗi product sẽ được assign 1-3 mùi random
- Không update lại products đã có fragrances

---

### 2. `testChatbot.js`
**Mục đích:** Test chatbot API với các scenarios khác nhau

**Khi nào dùng:**
- Sau khi deploy chatbot mới
- Test conversation memory
- Kiểm tra shopContext có đúng không

**Cách chạy:**
```bash
# Đảm bảo backend đang chạy
npm start

# Terminal khác
node scripts/testChatbot.js
```

**Test Scenarios:**
1. ✅ Hỏi về mùi hương
2. ✅ Hỏi về giá
3. ✅ Tư vấn quà tặng
4. ✅ Conversation memory (multi-turn)
5. ✅ Hỏi về shop

**Output mẫu:**
```
🧪 Starting Chatbot Tests...

📝 Test 1: Hỏi về mùi hương
------------------------------------------------------------
👤 User: Có mùi nào thơm nhẹ nhẹ không?
🤖 Bot: Shop mình có mấy mùi nhẹ nhàng bạn có thể thích: 
        Lavender (thư giãn), Vanilla (ngọt ngào), 
        hoặc White Tea (thanh tao) 🌸 
        Bạn thích loại nào nhất?

📊 Shop Context:
   - Fragrances: 18
   - Categories: 3
   - Sample Fragrances: Lavender, Rose, Vanilla, Jasmine, Ocean Breeze...
```

**Lưu ý:**
- Backend phải đang chạy
- Cần có OPENAI_API_KEY trong .env
- Có delay 1s giữa các request để tránh rate limit

---

## 🔧 Environment Requirements

Tất cả scripts cần file `.env` trong `backend/`:

```env
MONGODB_URI=mongodb://localhost:27017/aura_candle
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

---

## 🚀 Quick Start

### Lần Đầu Setup Chatbot

```bash
# 1. Seed fragrances vào products
node scripts/seedFragrances.js

# 2. Start backend
npm start

# 3. Test chatbot (terminal khác)
node scripts/testChatbot.js
```

### Troubleshooting

**Script không chạy được?**
```bash
# Check Node version
node --version  # Should be >= 14.x

# Install dependencies
npm install

# Check .env file
cat .env
```

**MongoDB connection error?**
```bash
# Check MongoDB đang chạy
mongosh

# Hoặc start MongoDB
brew services start mongodb-community  # Mac
sudo systemctl start mongod             # Linux
```

**OpenAI API error?**
- Check OPENAI_API_KEY có hợp lệ không
- Check quota còn không (https://platform.openai.com/usage)
- Check rate limit

---

## 📝 Thêm Script Mới

Muốn tạo script mới? Follow convention này:

```javascript
/**
 * Script description
 * Chạy: node scripts/yourScript.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Your logic here
        
        console.log('🎉 Done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
```

---

## 🆘 Support

Nếu có vấn đề:
1. Check backend logs
2. Check MongoDB connection
3. Check .env variables
4. Read error messages carefully

Happy scripting! 🚀

