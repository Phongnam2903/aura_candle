const cloudinary = require("../../config/cloudinary");
const { Product, Category } = require("../../models");
const mongoose = require("mongoose");
const fs = require("fs");

// =============================
// CREATE – Thêm sản phẩm
// =============================
const addProduct = async (req, res) => {
    try {
        const sellerId = req.user?.id;
        if (!sellerId) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập." });
        }

        let {
            name,
            sku,
            category,
            description,
            price,
            oldPrice,
            discount,
            stock,
            weightGrams,
            materials,
            isKit,
            fragrances, // frontend gửi mảng mùi hương
        } = req.body;

        // Nếu category không hợp lệ
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: "Category không hợp lệ" });
        }

        // Nếu không có materials, mặc định là mảng rỗng
        if (!Array.isArray(materials)) materials = [];

        // Chắc chắn fragrances là mảng
        if (!Array.isArray(fragrances)) fragrances = [];

        // Upload ảnh lên Cloudinary nếu có file gửi kèm
        let images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
                images.push(result.secure_url);

                // Xóa file tạm sau khi upload
                fs.unlinkSync(file.path);
            }
        }

        // Nếu người dùng gửi sẵn URL (đã upload từ frontend)
        if (req.body.images && Array.isArray(req.body.images)) {
            images = [...images, ...req.body.images];
        }

        // Tính giá nếu có oldPrice + discount
        if (oldPrice && discount && !price) {
            price = Math.round(oldPrice * (1 - discount / 100));
        }

        const newProduct = new Product({
            name,
            sku,
            category,
            description,
            price,
            oldPrice,
            discount,
            stock,
            weightGrams,
            images,
            materials, // giờ luôn là mảng rỗng nếu frontend không gửi
            isKit,
            fragrances,
            seller: sellerId,
        });

        await newProduct.save();

        res.status(201).json({
            message: "Thêm sản phẩm thành công",
            product: newProduct,
        });
    } catch (error) {
        console.error("Add product error:", error);
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error: error.message });
    }
};

// =============================
// READ – Lấy danh sách tất cả sản phẩm (có filter / pagination)
// =============================
const getProducts = async (req, res) => {
    try {
        const { category, keyword, page = 1, limit = 20 } = req.query;
        const query = {};
        if (category) query.category = category;
        if (keyword) query.name = { $regex: keyword, $options: "i" };

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;

        const products = await Product.find(query)
            .populate("category", "name")
            .populate("materials", "name")
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.json({
            total,
            page: pageNum,
            products,
        });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Failed to fetch products", error });
    }
};

// =============================
// READ – Lấy chi tiết 1 sản phẩm
// =============================
const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
    }

    try {
        const product = await Product.findById(id)
            .populate("category", "name")
            .populate("materials", "name");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({ message: "Failed to fetch product", error });
    }
};

// =============================
// UPDATE – Cập nhật sản phẩm
// =============================

const updateProduct = async (req, res) => {
    const sellerId = req.user?.id;
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        if (product.seller.toString() !== sellerId)
            return res.status(403).json({ message: "Bạn không có quyền sửa sản phẩm này" });

        // Lấy dữ liệu từ req.body
        let { materials, fragrances, oldImages, ...rest } = req.body;

        // Chắc chắn fragrances là array
        if (fragrances) {
            if (typeof fragrances === "string") {
                try {
                    fragrances = JSON.parse(fragrances); // nếu client gửi JSON string
                } catch {
                    fragrances = fragrances.split(",").map(f => f.trim()).filter(Boolean);
                }
            } else if (!Array.isArray(fragrances)) {
                fragrances = [fragrances];
            }
        } else {
            fragrances = [];
        }

        if (oldImages && typeof oldImages === "string") oldImages = JSON.parse(oldImages);

        // Upload ảnh mới
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
                uploadedImages.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        // Kết hợp ảnh cũ + mới
        const images = [...(oldImages || []), ...uploadedImages];

        // Chắc chắn các field kiểu number
        ["price", "oldPrice", "discount", "stock", "weightGrams"].forEach((field) => {
            if (rest[field] !== undefined) rest[field] = Number(rest[field]);
        });

        // Tính giá nếu cần
        if (rest.oldPrice !== undefined && rest.discount !== undefined && rest.price === undefined) {
            rest.price = Math.round(rest.oldPrice * (1 - rest.discount / 100));
        }

        // Tạo object update cuối cùng
        const updateData = { ...rest, materials, fragrances, images };

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate("category", "name")
            .populate("materials", "name");

        res.json({ message: "Cập nhật sản phẩm thành công", product: updatedProduct });
    } catch (error) {
        console.error("❌ Update product error:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
    }
};

module.exports = { updateProduct };

// =============================
// DELETE – Xóa sản phẩm
// =============================
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct)
            return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Failed to delete product", error });
    }
};

const searchProducrByName = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    try {
        const products = await Product.find({
            name: { $regex: query, $options: "i" }, // "i" = không phân biệt hoa thường
            isActive: true, // chỉ lấy sản phẩm còn hoạt động
        }).populate("category").populate("materials"); // nếu muốn hiển thị thông tin category/materials

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Tìm category theo slug
        const category = await Category.findOne({ slug });
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        // Lấy sản phẩm thuộc category này
        const products = await Product.find({ category: category._id })
            .populate("category", "name slug")
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (err) {
        console.error("❌ Lỗi khi lấy sản phẩm theo danh mục:", err);
        res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
    }
};

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    getProductBySlug,
    deleteProduct,
    searchProducrByName,
};
