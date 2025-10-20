const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// Lấy giỏ hàng theo user
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy giỏ hàng" });
  }
};

// Thêm sản phẩm vào giỏ
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const exist = cart.items.find((i) => i.product.toString() === productId);
    if (exist) {
      exist.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi thêm giỏ hàng" });
  }
};

// Xóa sản phẩm khỏi giỏ
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();

    res.json(await cart.populate("items.product"));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xóa sản phẩm" });
  }
};

// Cập nhật số lượng
const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (item) {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật số lượng" });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateQuantity };
