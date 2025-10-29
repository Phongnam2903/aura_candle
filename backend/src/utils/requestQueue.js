/**
 * Request Queue để throttle OpenAI API calls
 * Giới hạn: 3 requests per minute (RPM) cho free tier
 */

class RequestQueue {
    constructor(maxRequestsPerMinute = 3) {
        this.queue = [];
        this.processing = false;
        this.maxRPM = maxRequestsPerMinute;
        this.requestTimestamps = [];
    }

    /**
     * Kiểm tra có thể gửi request không (dựa trên rate limit)
     */
    canMakeRequest() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Xóa timestamps cũ hơn 1 phút
        this.requestTimestamps = this.requestTimestamps.filter(
            timestamp => timestamp > oneMinuteAgo
        );
        
        return this.requestTimestamps.length < this.maxRPM;
    }

    /**
     * Thêm request vào queue
     */
    async enqueue(requestFn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ requestFn, resolve, reject });
            this.processQueue();
        });
    }

    /**
     * Xử lý queue
     */
    async processQueue() {
        if (this.processing || this.queue.length === 0) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0) {
            if (!this.canMakeRequest()) {
                // Đợi đến khi có thể gửi request
                const oldestTimestamp = this.requestTimestamps[0];
                const waitTime = oldestTimestamp + 60000 - Date.now();
                
                console.log(`⏳ Request queue: Đợi ${Math.ceil(waitTime/1000)}s để tránh rate limit...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }

            const { requestFn, resolve, reject } = this.queue.shift();

            try {
                // Ghi nhận timestamp
                this.requestTimestamps.push(Date.now());
                
                // Thực hiện request
                const result = await requestFn();
                resolve(result);
            } catch (error) {
                reject(error);
            }

            // Delay nhỏ giữa các requests (100ms)
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.processing = false;
    }

    /**
     * Lấy thông tin queue
     */
    getStatus() {
        return {
            queueLength: this.queue.length,
            recentRequests: this.requestTimestamps.length,
            maxRPM: this.maxRPM,
            canMakeRequest: this.canMakeRequest()
        };
    }
}

// Singleton instance
const openAIQueue = new RequestQueue(3); // 3 RPM cho free tier

module.exports = openAIQueue;

