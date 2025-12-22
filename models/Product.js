const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Fruits", "Vegetables", "Dairy", "Bakery", "Beverages", "Snacks"],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    default: "kg",
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/200",
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Product", productSchema);
