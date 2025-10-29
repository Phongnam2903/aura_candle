# 🤖 Chatbot Nâng Cấp - Hướng Dẫn Sử Dụng

## 🎉 Tính Năng Mới

### ✅ Đã Nâng Cấp
1. **Hiểu Ngữ Cảnh (Context-Aware)**
   - Chatbot giờ biết tất cả sản phẩm trong shop
   - Biết tất cả mùi hương có sẵn
   - Biết danh mục sản phẩm

2. **Conversation Memory**
   - Nhớ 6 tin nhắn gần nhất
   - Hiểu luồng hội thoại
   - Trả lời dựa trên context

3. **Smart Recommendations**
   - Gợi ý sản phẩm phù hợp
   - Recommend theo mùi hương
   - Tư vấn theo dịp (sinh nhật, quà tặng...)

4. **UI Improvements**
   - Quick question buttons
   - Hiển thị mùi hương có sẵn
   - Typing animation đẹp hơn
   - Smooth scrolling

---

## 📋 Cách Hoạt Động

### Backend Flow

```
User Message
    ↓
1. Lấy Shop Context từ Database
   - Products (name, price, fragrances, category)
   - All Unique Fragrances
   - Categories
    ↓
2. Build Smart System Prompt
   - Inject fragrances list
   - Inject categories
   - Add tư vấn rules
    ↓
3. Build Conversation History
   - Lấy 6 tin nhắn gần nhất
   - Format: {role: "user/assistant", content: "..."}
    ↓
4. Call OpenAI GPT-3.5-turbo
   - System Prompt + History + New Message
   - Temperature: 0.7 (creative)
   - Max tokens: 300
    ↓
5. Return Response
   - Bot reply
   - Shop context (fragrances, categories)
```

### Frontend Flow

```
User clicks Quick Question hoặc nhập tin nhắn
    ↓
1. Add user message to UI
    ↓
2. Build conversation history
   - Map messages → {role, content}
    ↓
3. POST /chat/ với:
   - message: current message
   - conversationHistory: [...previous]
    ↓
4. Display bot reply
    ↓
5. Save shopContext
   - availableFragrances
   - categories
    ↓
6. Show fragrances panel (nếu có)
```

---

## 🎯 Ví Dụ Hội Thoại

### Scenario 1: Hỏi về mùi hương

**User:** "Có mùi nào thơm nhẹ nhàng?"

**Bot:** "Shop mình có mấy mùi nhẹ nhàng bạn có thể thích: Lavender (thư giãn), Vanilla (ngọt ngào), hoặc White Tea (thanh tao) 🌸 Bạn thích loại nào nhất?"

**User:** "Lavender có sản phẩm nào?"

**Bot:** "Có nha! Mình có Nến Lavender Chill 150g giá 120k - thơm dịu, giúp thư giãn và ngủ ngon 🕯️ Bạn muốn xem thêm chi tiết không?"

---

### Scenario 2: Tư vấn quà tặng

**User:** "Tặng sinh nhật bạn nên chọn nến gì?"

**Bot:** "Để tặng sinh nhật, mình recommend nến hương Rose hoặc Sweet Peach - thơm ngọt ngào và sang trọng 🎁 Hoặc bạn có thể chọn set quà tặng để trông xịn hơn nha!"

**User:** "Set quà có giá bao nhiêu?"

**Bot:** "Set quà mình có từ 250k - 500k, tùy loại nha! Bao gồm 2-3 nến mini + hộp đẹp. Bạn có budget khoảng bao nhiêu để mình tư vấn phù hợp? 💰"

---

### Scenario 3: Hỏi chung chung

**User:** "Nến của shop có đặc biệt gì?"

**Bot:** "Nến của shop mình 100% sáp đậu nành tự nhiên, không độc hại, cháy sạch và lâu 🕯️ Có ${fragrances.length} mùi hương từ nhẹ nhàng đến nồng nàn. Bạn muốn biết thêm về mùi nào không?"

---

## 🔧 Cấu Hình

### Backend Environment Variables

Đảm bảo có trong `.env`:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
MONGODB_URI=mongodb://localhost:27017/aura_candle
```

### Database Requirements

Chatbot cần các collection sau:

1. **Products**
   - `name`: Tên sản phẩm
   - `price`: Giá
   - `fragrances`: Array mùi hương
   - `category`: ObjectId (populate)
   - `isActive`: true/false

2. **Categories**
   - `name`: Tên danh mục

---

## 📊 Performance

- **Response Time:** 2-4 giây (tùy OpenAI API)
- **Conversation History:** Giữ 6 tin nhắn gần nhất
- **Product Limit:** 50 sản phẩm (để tránh prompt quá dài)
- **Retry Logic:** 3 lần nếu OpenAI bị rate limit

---

## 🚀 Cách Test

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

### 3. Mở Chat Widget
- Click vào icon chat ở góc phải dưới
- Thử các quick questions
- Xem panel "Mùi hương có sẵn"

### 4. Test Cases

**Test 1: Quick Questions**
- Click "Có mùi nào thơm nhẹ nhàng?"
- Kiểm tra bot có list mùi không

**Test 2: Conversation Memory**
- Hỏi: "Có mùi hoa hồng không?"
- Bot: "Có nha! Mùi Rose..."
- Hỏi tiếp: "Giá bao nhiêu?"
- Bot phải hiểu "giá" của mùi Rose

**Test 3: Fallback**
- Tắt internet hoặc sai OPENAI_API_KEY
- Bot phải trả lời fallback với mùi hương có sẵn

**Test 4: Fragrances Panel**
- Sau khi chat, panel phải hiển thị danh sách mùi
- Click vào mùi → có thể search

---

## 🎨 UI Features

### Quick Questions
- Hiển thị khi vừa mở chat (messages.length <= 1)
- 4 câu hỏi mẫu
- Click → Tự động gửi

### Fragrances Panel
- Hiển thị sau khi nhận response đầu tiên
- Giới hạn 12 mùi, còn lại hiển thị "+X mùi khác"
- Background gradient purple-pink

### Typing Indicator
- 3 chấm bounce animation
- Màu purple-pink

---

## 📝 System Prompt

Chatbot được train với prompt sau:

```
Bạn là AI tư vấn bán hàng thông minh của Aura Candle - shop nến thơm cao cấp.

📍 THÔNG TIN SHOP:
- Tổng sản phẩm: X loại nến thơm
- Danh mục: [...]
- Mùi hương có sẵn: [...]

🎯 NHIỆM VỤ:
1. Tư vấn sản phẩm phù hợp
2. Giới thiệu mùi hương
3. Gợi ý theo dịp
4. Trả lời về nến thơm

📝 CÁCH TRẢ LỜI:
- Thân thiện, emoji 🕯️
- Ngắn gọn 2-4 câu
- Hỏi về mùi → List mùi
- Hỏi về giá → Recommend
```

---

## ⚠️ Lưu Ý

1. **OpenAI API Key**
   - Cần có key hợp lệ
   - Có thể bị rate limit → retry 3 lần

2. **Database**
   - Products phải có field `fragrances` (array)
   - Products phải có `isActive: true`

3. **Fallback**
   - Nếu OpenAI fail → Trả về mùi hương có sẵn
   - User vẫn có thể interact

4. **Cost**
   - GPT-3.5-turbo: ~$0.002 / 1K tokens
   - Average: ~500 tokens/conversation
   - Cost: ~$0.001 per conversation

---

## 🔮 Có Thể Nâng Cấp Thêm

### Phase 2 (Future)
- [ ] Function calling để search sản phẩm real-time
- [ ] Image generation cho sản phẩm
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Analytics tracking (most asked questions)
- [ ] A/B testing different prompts
- [ ] Integration với CRM
- [ ] Auto-suggest products trong chat

### Phase 3 (Advanced)
- [ ] Fine-tune GPT model với shop data
- [ ] RAG (Retrieval Augmented Generation)
- [ ] Sentiment analysis
- [ ] Lead qualification
- [ ] Auto-create orders from chat

---

## 📞 Support

Nếu có vấn đề:

1. Check backend logs
2. Check OPENAI_API_KEY
3. Check database connection
4. Check browser console for frontend errors

---

**🎉 Happy Chatting! 🎉**

