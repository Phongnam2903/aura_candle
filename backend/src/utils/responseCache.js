/**
 * Response Cache để lưu câu trả lời OpenAI
 * Tiết kiệm API calls cho câu hỏi giống nhau
 */

const NodeCache = require('node-cache');

// Cache với TTL = 1 hour
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

/**
 * Tạo cache key từ message và context
 */
function createCacheKey(message, conversationHistory = []) {
    // Nếu có history → Không cache (context-dependent)
    if (conversationHistory.length > 0) {
        return null;
    }
    
    // Normalize message (lowercase, trim, remove extra spaces)
    const normalized = message.toLowerCase().trim().replace(/\s+/g, ' ');
    
    // Hash để làm key ngắn gọn
    return `chat:${normalized}`;
}

/**
 * Lấy cached response
 */
function getCachedResponse(message, conversationHistory = []) {
    const key = createCacheKey(message, conversationHistory);
    if (!key) return null;
    
    const cached = cache.get(key);
    if (cached) {
        console.log('✅ Cache HIT:', key);
        return cached;
    }
    
    console.log('❌ Cache MISS:', key);
    return null;
}

/**
 * Lưu response vào cache
 */
function setCachedResponse(message, conversationHistory, response) {
    const key = createCacheKey(message, conversationHistory);
    if (!key) return false;
    
    cache.set(key, response);
    console.log('💾 Cached response:', key);
    return true;
}

/**
 * Xóa cache (nếu cần)
 */
function clearCache() {
    cache.flushAll();
    console.log('🗑️ Cache cleared');
}

/**
 * Lấy stats
 */
function getCacheStats() {
    return cache.getStats();
}

module.exports = {
    getCachedResponse,
    setCachedResponse,
    clearCache,
    getCacheStats
};

