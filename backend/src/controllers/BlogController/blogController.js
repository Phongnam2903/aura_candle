const { Blog, User, Notification } = require("../../models");

// Lấy tất cả blogs (public)
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Lấy blogs của seller
const getSellerBlogs = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const blogs = await Blog.find({ author: sellerId })
            .populate("author", "name email")
            .sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Lấy chi tiết 1 blog
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("author", "name email");
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Tạo blog mới (seller only)
const createBlog = async (req, res) => {
    try {
        const { title, description, content, images, link } = req.body;
        const author = req.user.id;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const blog = new Blog({
            title,
            description,
            content,
            images: images || [],
            link,
            author,
        });

        await blog.save();
        const populatedBlog = await Blog.findById(blog._id).populate("author", "name email");

        // 🔔 Gửi thông báo cho tất cả người dùng
        try {
            // Lấy tất cả users (có thể lọc theo điều kiện nếu cần)
            const allUsers = await User.find({ role: { $ne: "seller" } }).select("_id");
            
            if (allUsers.length > 0) {
                // Tạo mảng notifications cho tất cả users
                const notifications = allUsers.map(user => ({
                    user: user._id,
                    title: "📰 Bài viết mới!",
                    message: `${populatedBlog.author.name || "Seller"} vừa đăng bài viết mới: "${title}"`,
                    type: "Blog",
                    relatedBlog: blog._id,
                }));

                // Insert nhiều notifications cùng lúc
                await Notification.insertMany(notifications);
                console.log(`✅ Đã gửi thông báo blog mới cho ${allUsers.length} người dùng`);
            }
        } catch (notifError) {
            console.error("⚠️ Lỗi khi gửi thông báo blog:", notifError);
            // Không block response nếu notification fail
        }

        res.status(201).json({
            ok: true,
            message: "Blog created successfully",
            data: populatedBlog,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Cập nhật blog (chỉ author mới được sửa)
const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;
        const { title, description, content, images, link } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        // Kiểm tra quyền sở hữu
        if (blog.author.toString() !== userId) {
            return res.status(403).json({ error: "You are not authorized to edit this blog" });
        }

        // Cập nhật các trường
        if (title !== undefined) blog.title = title;
        if (description !== undefined) blog.description = description;
        if (content !== undefined) blog.content = content;
        if (images !== undefined) blog.images = images;
        if (link !== undefined) blog.link = link;

        await blog.save();
        const updatedBlog = await Blog.findById(blog._id).populate("author", "name email");

        res.json({
            ok: true,
            message: "Blog updated successfully",
            data: updatedBlog,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Xóa blog (chỉ author mới được xóa)
const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        // Kiểm tra quyền sở hữu
        if (blog.author.toString() !== userId) {
            return res.status(403).json({ error: "You are not authorized to delete this blog" });
        }

        await Blog.findByIdAndDelete(blogId);

        res.json({
            ok: true,
            message: "Blog deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getAllBlogs,
    getSellerBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
};

