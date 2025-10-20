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

        // Lấy dữ liệu từ request
        const {
            name,
            sku,
            category,
            description,
            price,
            oldPrice,
            discount,
            stock,
            weightGrams,
            materials = [],
            isKit = false,
            fragrances = [],
            images = []
        } = req.body;

        console.log("=== NHẬN DỮ LIỆU TỪ FRONTEND ===");
        console.log("Images:", images);
        console.log("Fragrances:", fragrances);
        console.log("Category:", category);
        console.log("Name:", name);
        console.log("SKU:", sku);
        console.log("=================================");

        // Validate category
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: "Category không hợp lệ" });
        }

        // Xử lý fragrances - đảm bảo là array
        let processedFragrances = [];
        if (fragrances && fragrances.length > 0) {
            if (typeof fragrances === "string") {
                processedFragrances = fragrances.split(",").map(f => f.trim()).filter(Boolean);
            } else if (Array.isArray(fragrances)) {
                processedFragrances = fragrances.filter(f => f && f.trim());
            }
        }

        // Xử lý materials - đảm bảo là array
        let processedMaterials = [];
        if (materials && materials.length > 0) {
            processedMaterials = Array.isArray(materials) ? materials : [];
        }

        // Xử lý images - đảm bảo là array
        let processedImages = [];
        if (images && images.length > 0) {
            processedImages = Array.isArray(images) ? images : [];
        }

        // Upload ảnh mới nếu có file gửi kèm
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
                processedImages.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        // Tính giá nếu có oldPrice + discount
        let finalPrice = price;
        if (oldPrice && discount && !price) {
            finalPrice = Math.round(oldPrice * (1 - discount / 100));
        }

        // Tạo sản phẩm mới
        const newProduct = new Product({
            name,
            sku,
            category,
            description,
            price: finalPrice,
            oldPrice: oldPrice || null,
            discount: discount || 0,
            stock: stock || 0,
            weightGrams: weightGrams || null,
            images: processedImages,
            materials: processedMaterials,
            isKit: isKit || false,
            fragrances: processedFragrances,
            seller: sellerId,
        });

        console.log("=== DỮ LIỆU TRƯỚC KHI LƯU ===");
        console.log("Images:", processedImages);
        console.log("Fragrances:", processedFragrances);
        console.log("Materials:", processedMaterials);
        console.log("===============================");

        console.log("=== TRƯỚC KHI SAVE ===");
        console.log("newProduct:", newProduct);

        await newProduct.save();

        console.log("=== SAU KHI SAVE ===");
        console.log("Product saved successfully");

        res.status(201).json({
            message: "Thêm sản phẩm thành công",
            product: newProduct,
        });
    } catch (error) {
        console.error("❌ ADD PRODUCT ERROR:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({
            message: "Lỗi khi thêm sản phẩm",
            error: error.message,
            details: error.name === 'ValidationError' ? error.errors : null
        });
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
    try {
        const productId = req.params.id;
        const {
            name,
            sku,
            description,
            price,
            oldPrice,
            discount,
            stock,
            weightGrams,
            isKit,
            category,
            fragrances,
            materials,
            images,
        } = req.body;

        // ✅ Kiểm tra id sản phẩm
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ ok: false, message: "ID sản phẩm không hợp lệ" });

        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ ok: false, message: "Không tìm thấy sản phẩm" });

        // ✅ Chuẩn hóa dữ liệu nhận vào
        const updatedFields = {};

        if (name) updatedFields.name = name.trim();
        if (sku) updatedFields.sku = sku.trim();
        if (description) updatedFields.description = description;
        if (price) updatedFields.price = parseFloat(price);
        if (oldPrice) updatedFields.oldPrice = parseFloat(oldPrice);
        if (discount) updatedFields.discount = parseFloat(discount);
        if (stock) updatedFields.stock = parseInt(stock);
        if (weightGrams) updatedFields.weightGrams = parseFloat(weightGrams);
        if (typeof isKit !== "undefined") updatedFields.isKit = isKit === "true" || isKit === true;

        // ✅ Category
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            updatedFields.category = category;
        }

        // ✅ Materials
        if (materials) {
            const parsedMaterials =
                typeof materials === "string" ? JSON.parse(materials) : materials;
            if (Array.isArray(parsedMaterials)) {
                updatedFields.materials = parsedMaterials;
            }
        }

        // ✅ Fragrances
        if (fragrances) {
            const parsedFragrances =
                typeof fragrances === "string" ? JSON.parse(fragrances) : fragrances;
            if (Array.isArray(parsedFragrances)) {
                updatedFields.fragrances = parsedFragrances;
            }
        }

        // ✅ Ảnh
        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            // Có upload ảnh mới
            const uploaded = await Promise.all(
                req.files.map(async (file) => {
                    const result = await uploadImage(file.path);
                    return result.secure_url;
                })
            );
            imageUrls = uploaded;
        } else if (images) {
            // Giữ ảnh cũ từ frontend
            const parsedImages = typeof images === "string" ? JSON.parse(images) : images;
            if (Array.isArray(parsedImages)) imageUrls = parsedImages;
        }

        if (imageUrls.length > 0) {
            updatedFields.images = imageUrls;
        }

        // ✅ Cập nhật
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updatedFields },
            { new: true }
        )
            .populate("category", "name")
            .populate("materials", "name");

        res.json({ ok: true, message: "Cập nhật sản phẩm thành công", data: updatedProduct });
    } catch (error) {
        console.error("❌ Lỗi cập nhật sản phẩm:", error);
        res.status(500).json({ ok: false, message: "Lỗi máy chủ", error: error.message });
    }
};


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

const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId, excludeId } = req.query;

        console.log("=== /product/related called ===");
        console.log("Received query:", req.query);

        if (!categoryId) {
            console.log("categoryId missing!");
            return res.status(400).json({ ok: false, message: "Thiếu categoryId" });
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            console.log("Invalid categoryId:", categoryId);
            return res.status(400).json({ ok: false, message: "ID category không hợp lệ" });
        }

        let filter = { category: categoryId };

        if (excludeId) {
            if (mongoose.Types.ObjectId.isValid(excludeId)) {
                filter._id = { $ne: excludeId };
                console.log("Excluding product:", excludeId);
            } else {
                console.log("Invalid excludeId, ignoring:", excludeId);
            }
        }

        console.log("Mongo filter:", filter);

        const products = await Product.find(filter).limit(10);
        console.log("Found products:", products.length);
        console.log("categoryId:", categoryId, "valid?", mongoose.Types.ObjectId.isValid(categoryId));
        console.log("excludeId:", excludeId, "valid?", mongoose.Types.ObjectId.isValid(excludeId));

        res.json({ ok: true, products });
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ ok: false, message: "Lỗi server" });
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
    getProductsByCategory,
};
