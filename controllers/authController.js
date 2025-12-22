const User = require("../models/User");
const Cart = require("../models/Cart");

exports.getRegister = (req, res) => {
  res.render("register", { error: null });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render("register", { error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render("register", { error: "Email already registered" });
    }

    const user = new User({ name, email, password });
    await user.save();

    // Create empty cart for new user
    const cart = new Cart({ user: user._id, items: [] });
    await cart.save();

    req.session.userId = user._id;
    req.session.userName = user.name;
    res.redirect("/products");
  } catch (err) {
    console.error("Registration error:", err);
    res.render("register", { error: "Registration failed. Please try again." });
  }
};

exports.getLogin = (req, res) => {
  res.render("login", { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.render("login", { error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid email or password" });
    }

    req.session.userId = user._id;
    req.session.userName = user.name;
    res.redirect("/products");
  } catch (err) {
    res.render("login", { error: "Login failed. Please try again." });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/products");
    }
    res.redirect("/auth/login");
  });
};
