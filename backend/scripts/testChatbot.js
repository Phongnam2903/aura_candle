/**
 * Script để test chatbot API
 * Chạy: node scripts/testChatbot.js
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test scenarios
const testScenarios = [
    {
        name: 'Test 1: Hỏi về mùi hương',
        messages: [
            { text: 'Có mùi nào thơm nhẹ nhẹ không?' }
        ]
    },
    {
        name: 'Test 2: Hỏi về giá',
        messages: [
            { text: 'Nến giá bao nhiêu?' }
        ]
    },
    {
        name: 'Test 3: Tư vấn quà tặng',
        messages: [
            { text: 'Tặng sinh nhật bạn gái nên chọn nến gì?' }
        ]
    },
    {
        name: 'Test 4: Conversation Memory',
        messages: [
            { text: 'Có mùi hoa hồng không?', expectedKeywords: ['Rose', 'rose', 'hồng'] },
            { text: 'Giá bao nhiêu?', expectedKeywords: [] } // Should remember "Rose"
        ]
    },
    {
        name: 'Test 5: Hỏi về shop',
        messages: [
            { text: 'Shop có những loại nến gì?' }
        ]
    }
];

async function testChat(message, conversationHistory = []) {
    try {
        const response = await axios.post(`${BASE_URL}/chat/`, {
            message,
            conversationHistory
        });

        return response.data;
    } catch (error) {
        console.error('❌ API Error:', error.response?.data || error.message);
        return null;
    }
}

async function runTests() {
    console.log('🧪 Starting Chatbot Tests...\n');
    console.log('=' .repeat(60));

    for (const scenario of testScenarios) {
        console.log(`\n📝 ${scenario.name}`);
        console.log('-'.repeat(60));

        const conversationHistory = [];

        for (const msg of scenario.messages) {
            // Gửi message
            console.log(`\n👤 User: ${msg.text}`);
            
            const result = await testChat(msg.text, conversationHistory);

            if (!result) {
                console.log('❌ Failed to get response');
                continue;
            }

            console.log(`🤖 Bot: ${result.reply}`);

            // Check shopContext
            if (result.shopContext) {
                console.log(`\n📊 Shop Context:`);
                console.log(`   - Fragrances: ${result.shopContext.availableFragrances?.length || 0}`);
                console.log(`   - Categories: ${result.shopContext.categories?.length || 0}`);
                
                if (result.shopContext.availableFragrances?.length > 0) {
                    console.log(`   - Sample Fragrances: ${result.shopContext.availableFragrances.slice(0, 5).join(', ')}...`);
                }
            }

            // Check expected keywords
            if (msg.expectedKeywords && msg.expectedKeywords.length > 0) {
                const foundKeywords = msg.expectedKeywords.filter(kw => 
                    result.reply.toLowerCase().includes(kw.toLowerCase())
                );
                
                if (foundKeywords.length > 0) {
                    console.log(`✅ Found keywords: ${foundKeywords.join(', ')}`);
                } else {
                    console.log(`⚠️  Expected keywords not found: ${msg.expectedKeywords.join(', ')}`);
                }
            }

            // Update conversation history
            conversationHistory.push({
                role: 'user',
                content: msg.text
            });
            conversationHistory.push({
                role: 'assistant',
                content: result.reply
            });

            // Delay để tránh rate limit
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('\n' + '='.repeat(60));
    }

    console.log('\n✅ All tests completed!\n');
}

// Check if server is running
async function checkServer() {
    try {
        await axios.get(`${BASE_URL}/`);
        return true;
    } catch (error) {
        console.error('❌ Backend server is not running!');
        console.error('   Please start the server first: npm start');
        return false;
    }
}

// Main
(async () => {
    console.log('🔍 Checking if backend server is running...\n');
    
    const serverRunning = await checkServer();
    if (!serverRunning) {
        process.exit(1);
    }

    console.log('✅ Server is running!\n');
    
    await runTests();
    process.exit(0);
})();

