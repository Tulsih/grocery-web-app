const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.userId }).populate(
      "items.product"
    );

    if (!cart) {
      return res.render("cart", {
        cartItems: [],
        totalPrice: 0,
        totalItems: 0,
        userName: req.session.userName,
      });
    }

    const totalPrice = cart.getTotalPrice();
    const totalItems = cart.getTotalItems();

    res.render("cart", {
      cartItems: cart.items,
      totalPrice: totalPrice.toFixed(2),
      totalItems,
      userName: req.session.userName,
    });
  } catch (err) {
    res.status(500).send("Error loading cart");
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      cart = new Cart({ user: req.session.userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate("items.product");

    res.json({
      success: true,
      message: "Product added to cart",
      cartItemCount: cart.getTotalItems(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { itemId, action } = req.body;
    const cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.items.pull(itemId);
      }
    }

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate("items.product");

    res.json({
      success: true,
      totalPrice: cart.getTotalPrice().toFixed(2),
      totalItems: cart.getTotalItems(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating quantity" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items.pull(itemId);
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate("items.product");

    res.json({
      success: true,
      message: "Item removed from cart",
      totalPrice: cart.getTotalPrice().toFixed(2),
      totalItems: cart.getTotalItems(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error removing item" });
  }
};
