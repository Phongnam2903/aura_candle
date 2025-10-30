/**
 * Test Blog API - Chạy file này để test các endpoint blog
 * 
 * Cách sử dụng:
 * 1. Thay đổi API_URL thành URL backend của bạn
 * 2. Thay đổi TOKEN thành JWT token hợp lệ (lấy từ localStorage sau khi login)
 * 3. Chạy: node test-blog-api.js
 */

const axios = require("axios");

// ===== CẤU HÌNH =====
const API_URL = "https://aura-candle.onrender.com"; // Thay đổi URL này
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Thay đổi token này (nếu test protected routes)

// ===== HELPER FUNCTIONS =====
const log = {
  success: (msg) => console.log("✅", msg),
  error: (msg) => console.log("❌", msg),
  info: (msg) => console.log("ℹ️", msg),
  section: (msg) => console.log("\n" + "=".repeat(50) + "\n" + msg + "\n" + "=".repeat(50)),
};

// ===== TEST FUNCTIONS =====

// Test 1: Kiểm tra server hoạt động
async function testServerHealth() {
  log.section("TEST 1: Server Health Check");
  try {
    const res = await axios.get(`${API_URL}/`);
    log.success("Server is running!");
    console.log(res.data);
    return true;
  } catch (err) {
    log.error("Server is not responding!");
    console.error(err.message);
    return false;
  }
}

// Test 2: Lấy tất cả blogs (public)
async function testGetAllBlogs() {
  log.section("TEST 2: GET /blog - Get All Blogs (Public)");
  try {
    const res = await axios.get(`${API_URL}/blog`);
    log.success(`Found ${res.data.length} blogs`);
    if (res.data.length > 0) {
      console.log("First blog:", res.data[0]);
    }
    return true;
  } catch (err) {
    log.error("Failed to get blogs");
    console.error(err.response?.data || err.message);
    return false;
  }
}

// Test 3: Lấy blogs của seller (protected)
async function testGetSellerBlogs() {
  log.section("TEST 3: GET /blog/seller/my-blogs - Get Seller's Blogs (Protected)");
  
  if (!TOKEN || TOKEN === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") {
    log.info("Skipping - TOKEN not configured. Please set a valid JWT token.");
    return false;
  }

  try {
    const res = await axios.get(`${API_URL}/blog/seller/my-blogs`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    log.success(`Found ${res.data.length} blogs from this seller`);
    if (res.data.length > 0) {
      console.log("First blog:", res.data[0]);
    }
    return true;
  } catch (err) {
    log.error("Failed to get seller blogs");
    console.error(err.response?.data || err.message);
    return false;
  }
}

// Test 4: Tạo blog mới (protected)
async function testCreateBlog() {
  log.section("TEST 4: POST /blog - Create New Blog (Protected)");
  
  if (!TOKEN || TOKEN === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") {
    log.info("Skipping - TOKEN not configured. Please set a valid JWT token.");
    return false;
  }

  const newBlog = {
    title: "Test Blog - " + new Date().toISOString(),
    description: "This is a test blog created by automated test script",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    images: ["https://example.com/image1.jpg"],
    link: "https://example.com",
  };

  try {
    const res = await axios.post(`${API_URL}/blog`, newBlog, {
      headers: { 
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    log.success("Blog created successfully!");
    console.log("New blog:", res.data);
    return res.data.data._id; // Return blog ID for further tests
  } catch (err) {
    log.error("Failed to create blog");
    console.error(err.response?.data || err.message);
    return false;
  }
}

// Test 5: Lấy chi tiết blog theo ID
async function testGetBlogById(blogId) {
  log.section("TEST 5: GET /blog/:id - Get Blog By ID (Public)");
  
  if (!blogId) {
    log.info("Skipping - No blog ID available");
    return false;
  }

  try {
    const res = await axios.get(`${API_URL}/blog/${blogId}`);
    log.success("Blog found!");
    console.log(res.data);
    return true;
  } catch (err) {
    log.error("Failed to get blog by ID");
    console.error(err.response?.data || err.message);
    return false;
  }
}

// Test 6: Test route không tồn tại (expected 404)
async function testNotFoundRoute() {
  log.section("TEST 6: 404 Error Handling");
  try {
    const res = await axios.get(`${API_URL}/nonexistent-route`);
    log.error("Should return 404 but got success response");
    return false;
  } catch (err) {
    if (err.response?.status === 404) {
      log.success("404 handling works correctly!");
      console.log(err.response.data);
      return true;
    } else {
      log.error("Unexpected error");
      console.error(err.message);
      return false;
    }
  }
}

// ===== MAIN TEST RUNNER =====
async function runTests() {
  console.log("\n🚀 Starting Blog API Tests...\n");
  console.log(`API URL: ${API_URL}`);
  console.log(`Token configured: ${TOKEN !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ? "Yes" : "No"}\n`);

  const results = {
    passed: 0,
    failed: 0,
  };

  // Chạy các tests
  const tests = [
    { name: "Server Health", fn: testServerHealth },
    { name: "Get All Blogs", fn: testGetAllBlogs },
    { name: "Get Seller Blogs", fn: testGetSellerBlogs },
  ];

  for (const test of tests) {
    const result = await test.fn();
    if (result) results.passed++;
    else results.failed++;
  }

  // Test create blog và get by ID (nếu có token)
  if (TOKEN && TOKEN !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") {
    const newBlogId = await testCreateBlog();
    if (newBlogId) {
      results.passed++;
      const getBlogResult = await testGetBlogById(newBlogId);
      if (getBlogResult) results.passed++;
      else results.failed++;
    } else {
      results.failed++;
    }
  }

  // Test 404
  const notFoundResult = await testNotFoundRoute();
  if (notFoundResult) results.passed++;
  else results.failed++;

  // Kết quả
  log.section("TEST RESULTS");
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total: ${results.passed + results.failed}`);
  
  if (results.failed === 0) {
    log.success("\n🎉 All tests passed!");
  } else {
    log.error("\n⚠️ Some tests failed. Check the logs above.");
  }
}

// Chạy tests
runTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

