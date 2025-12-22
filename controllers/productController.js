const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query);
    const categories = await Product.distinct("category");

    const cart = await Cart.findOne({ user: req.session.userId });
    const cartItemCount = cart ? cart.getTotalItems() : 0;

    res.render("products", {
      products,
      categories,
      selectedCategory: category || "All",
      searchQuery: search || "",
      userName: req.session.userName,
      cartItemCount,
    });
  } catch (err) {
    res.status(500).send("Error loading products");
  }
};

exports.seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});

    const sampleProducts = [
      {
        name: "Apple",
        category: "Fruits",
        price: 120,
        unit: "kg",
        image:
          "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200",
      },
      {
        name: "Banana",
        category: "Fruits",
        price: 60,
        unit: "dozen",
        image:
          "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200",
      },
      {
        name: "Orange",
        category: "Fruits",
        price: 80,
        unit: "kg",
        image:
          "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=200",
      },
      {
        name: "Tomato",
        category: "Vegetables",
        price: 40,
        unit: "kg",
        image:
          "https://images.unsplash.com/photo-1546470427-0d28f2e75b38?w=200",
      },
      {
        name: "Potato",
        category: "Vegetables",
        price: 30,
        unit: "kg",
        image:
          "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200",
      },
      {
        name: "Carrot",
        category: "Vegetables",
        price: 50,
        unit: "kg",
        image:
          "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200",
      },
      {
        name: "Milk",
        category: "Dairy",
        price: 60,
        unit: "liter",
        image:
          "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200",
      },
      {
        name: "Cheese",
        category: "Dairy",
        price: 200,
        unit: "250g",
        image:
          "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200",
      },
      {
        name: "Bread",
        category: "Bakery",
        price: 40,
        unit: "piece",
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200",
      },
      {
        name: "Cookies",
        category: "Bakery",
        price: 80,
        unit: "pack",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200",
      },
      {
        name: "Orange Juice",
        category: "Beverages",
        price: 90,
        unit: "liter",
        image:
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200",
      },
      {
        name: "Coffee",
        category: "Beverages",
        price: 350,
        unit: "500g",
        image:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200",
      },
    ];

    await Product.insertMany(sampleProducts);
    res.redirect("/products");
  } catch (err) {
    res.status(500).send("Error seeding products");
  }
};
