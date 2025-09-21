const { Product } = require("../../models");

// Thêm product mới
const addProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            category,
            description,
            price,
            stock,
            weightGrams,
            images,
            materials,
            isKit,
        } = req.body;

        // Tạo product mới
        const newProduct = new Product({
            name,
            sku,
            category,
            description,
            price,
            stock,
            weightGrams,
            images,
            materials,
            isKit,
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

module.exports = { addProduct };
