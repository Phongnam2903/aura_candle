// Test script để kiểm tra Dashboard API
const axios = require('axios');

async function testDashboardAPI() {
    try {
        console.log("🧪 Testing Dashboard API...\n");
        
        // Thay YOUR_TOKEN bằng token thực của seller
        const token = "YOUR_SELLER_TOKEN_HERE";
        
        const response = await axios.get('http://localhost:5000/dashboard/seller', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log("✅ API Response Status:", response.status);
        console.log("\n📊 Response Data:");
        console.log(JSON.stringify(response.data, null, 2));
        
        // Kiểm tra structure
        console.log("\n🔍 Data Structure Check:");
        console.log("- ok:", response.data.ok);
        console.log("- data exists:", !!response.data.data);
        console.log("- revenueChart exists:", !!response.data.data?.revenueChart);
        console.log("- revenueChart length:", response.data.data?.revenueChart?.length);
        console.log("- customersChart exists:", !!response.data.data?.customersChart);
        console.log("- customersChart length:", response.data.data?.customersChart?.length);
        console.log("- todayOrders exists:", !!response.data.data?.todayOrders);
        console.log("- todayOrders length:", response.data.data?.todayOrders?.length);
        
    } catch (error) {
        console.error("❌ Error testing API:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testDashboardAPI();

