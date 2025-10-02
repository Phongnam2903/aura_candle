const { Product } = require("../../models");

// =============================
// CREATE – Thêm sản phẩm
// =============================
const addProduct = async (req, res) => {
    try {
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
            images,
            materials,
            isKit,
            fragrance,
            fragrances,
        } = req.body;

        // 🔥 Nếu có oldPrice + discount thì tự động tính price
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
            materials,
            isKit,
            fragrance,
            fragrances,
        });

        await newProduct.save();
        res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
        });
    } catch (error) {
        console.error("Add product error:", error);
        res.status(500).json({ message: "Failed to create product", error });
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
    try {
        const product = await Product.findById(req.params.id)
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
        let updateData = { ...req.body };

        // 🔥 Nếu update có oldPrice/discount mà không truyền price => tính lại
        if (
            (updateData.oldPrice !== undefined && updateData.discount !== undefined) &&
            updateData.price === undefined
        ) {
            updateData.price = Math.round(
                updateData.oldPrice * (1 - updateData.discount / 100)
            );
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate("category", "name")
            .populate("materials", "name");

        if (!updatedProduct)
            return res.status(404).json({ message: "Product not found" });

        res.json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: "Failed to update product", error });
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

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
