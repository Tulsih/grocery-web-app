const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, cartController.getCart);
router.post("/add", isAuthenticated, cartController.addToCart);
router.post("/update", isAuthenticated, cartController.updateQuantity);
router.post("/remove", isAuthenticated, cartController.removeFromCart);

module.exports = router;
