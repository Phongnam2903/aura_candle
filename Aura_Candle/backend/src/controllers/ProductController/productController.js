const cloudinary = require("../../config/cloudinary");
const { Product } = require("../../models");
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
            fragrance,
            fragrances,
        } = req.body;

        let images = [];

        // ✅ Upload ảnh lên Cloudinary nếu có file gửi kèm
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
                images.push(result.secure_url);
            }
        }

        // ✅ Nếu người dùng gửi sẵn URL (đã upload từ trước)
        if (req.body.images && Array.isArray(req.body.images)) {
            images = [...images, ...req.body.images];
        }

        // ✅ Tính giá nếu có oldPrice + discount
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
            images, //  link Cloudinary
            materials,
            isKit,
            fragrance,
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
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
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
    const sellerId = req.user?.id; // Lấy ID người bán từ token
    const { id } = req.params;

    try {
        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        // Kiểm tra quyền sở hữu sản phẩm
        if (product.seller.toString() !== sellerId) {
            return res
                .status(403)
                .json({ message: "Bạn không có quyền sửa sản phẩm này" });
        }

        // Chuẩn bị dữ liệu update
        let updateData = { ...req.body };
        let uploadedImages = [];

        // Upload ảnh mới lên Cloudinary nếu có
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
                uploadedImages.push(result.secure_url);

                // Xóa file tạm sau khi upload
                fs.unlinkSync(file.path);
            }
        }

        // Giữ lại ảnh cũ (nếu có gửi từ frontend)
        if (req.body.oldImages) {
            // Nếu oldImages là chuỗi JSON (trường hợp gửi bằng FormData)
            const oldImages = Array.isArray(req.body.oldImages)
                ? req.body.oldImages
                : JSON.parse(req.body.oldImages);

            uploadedImages = [...oldImages, ...uploadedImages];
        }

        updateData.images = uploadedImages;

        // Tính toán giá mới nếu cần
        if (
            updateData.oldPrice !== undefined &&
            updateData.discount !== undefined &&
            updateData.price === undefined
        ) {
            updateData.price = Math.round(
                updateData.oldPrice * (1 - updateData.discount / 100)
            );
        }

        // Cập nhật sản phẩm trong DB
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate("category", "name")
            .populate("materials", "name");

        res.json({
            message: "Cập nhật sản phẩm thành công",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("❌ Update product error:", error);
        res.status(500).json({
            message: "Lỗi khi cập nhật sản phẩm",
            error: error.message,
        });
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

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducrByName,
};
