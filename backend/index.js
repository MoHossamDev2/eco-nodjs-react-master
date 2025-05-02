const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

require("dotenv").config();

const User = require("./models/user.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");

const mongodbURL = process.env.MONGODB_URI || "mongodb://localhost:27017/CS309Project";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log("connection to database failed", err);
  });

//    signup     //

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);

    if (await User.findOne({ email: user.email })) {
      return res.json({ success: false, message: "This email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.json({
      success: true,
      message: "user added successfully",
      user: user,
    });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
});
//   login   //
app.post(`/login`, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ success: false, message: "this email not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({ success: false, message: "wrong password" });
    }
    return res.json({
      success: true,
      message: "user logged in successfully",
      user: user,
    });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
});

// delete user //

app.delete("/deleteUser", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.findOneAndDelete({ email: userEmail });

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    res.json({ success: true, message: "user deleted successfully" });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
});

//  update user //

app.patch("/updateUser", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    const updatedData = {};

    if (req.body.password) {
      if (
        !req.body.confirmPassword ||
        req.body.password !== req.body.confirmPassword
      ) {
        return res.json({
          success: false,
          message: "passwords do not match confirmPassword",
        });
      }
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(req.body.password, salt);
    }

    // الطريقة طويلة لكن انا هندلتها بالطريقة دي عشان انا مش عارف
    //اليوزر عايز يحدث اني اتربيوت بالظبط فانا لازم اشوف هو باعت يحدث اي واحدثهولة //

    if (req.body.name) {
      updatedData.name = req.body.name;
    }

    if (req.body.address) {
      updatedData.address = req.body.address;
    }
    if (req.body.image) {
      updatedData.image = req.body.image;
    }
    if (req.body.phone) {
      updatedData.phone = req.body.phone;
    }

    await User.updateOne(user, updatedData);
    res.json({ success: true, message: "user updated successfully" });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
});

//     add product      //

app.post("/addProduct", async (req, res) => {
  try {
    const product = new Product(req.body);

    if (product.stock === 0) {
      product.soldOut = true;
    }

    if (await Product.findOne({ name: product.name })) {
      // we will add logic if this product exist add 1 more on the stock of this product
    }
    await product.save();
    res.json({
      success: true,
      message: "product added successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "something went wrong",
      err: err.message,
    });
  }
});

app.get(`/allProducts`, async (req, res) => {
  try {
    const products = await Product.find();
    if (!products.length) {
      return res.json({ success: false, message: "there are no products yet" });
    }
    res.json({ success: true, products: products });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
});

app.get(`/product/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ success: false, message: "Invalid product ID" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.json({
        success: false,
        message: "there is no product with this id",
      });
    }
    res.json({ success: true, product: product });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
});

app.get(`/products/:category`, async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: category });
    if (!products.length) {
      return res.json({
        success: false,
        message: "there is no products with this category",
      });
    }
    res.json({ success: true, products: products });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
});

app.delete(`/product/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ success: false, message: "Invalid product ID" });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.json({
        success: false,
        message: "there is no product with this id",
      });
    }
    res.json({ success: true, message: "the product has been deleted" });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
});

app.patch(`/editProduct/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.stock === 0) {
      updates.soldOut = true;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ success: false, message: "Invalid product ID" });
    }

    await Product.updateOne({ _id: id }, { $set: updates });
    const updatedProduct = await Product.findById(id);
    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
});

app.patch(`/product/rate`, async (req, res) => {
  try {
    const { productID, userID, rating } = req.body;

    if (!productID || !userID) {
      return res.json({ success: false, message: "Invalid input" });
    }
    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    const product = await Product.findById(productID);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const existingRating = product.rate.ratings.find(
      (r) => r.userID.toString() === userID
    );
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      product.rate.ratings.push({ userID, rating });
      product.rate.usersCount += 1;
    }

    const totalRatings = product.rate.ratings.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    product.rate.average =
      product.rate.usersCount > 0 ? totalRatings / product.rate.usersCount : 0;

    await product.save();
    res.json({
      success: true,
      message: "Successfully user rated",
      rate: product.rate,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went wrong",
      err: err.message,
    });
  }
});

app.post(`/pushInCart`, async (req, res) => {
  try {
    const { userID, productID, count } = req.body;
    if (!userID || !productID || !count) {
      return res.json({ success: false, message: "Invalid input" });
    }
    const product = await Product.findById(productID);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    if (product.soldOut) {
      return res.json({ success: false, message: "Product out of stock" });
    }
    const stock = product.stock;
    const user = await User.findById(userID);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const existingProduct = user.cart.find(
      (item) => item.productID.toString() === productID
    );

    if (existingProduct) {
      if (existingProduct.count + count > stock) {
        return res.json({
          success: false,
          message: "Your order amount exceeds stock",
        });
      }
      existingProduct.count += count;
    } else {
      if (count > stock) {
        return res.json({
          success: false,
          message: "Your order amount exceeds stock",
        });
      }
      user.cart.push({ productID, count });
    }
    await user.save();
    return res.json({ success: true, cart: user.cart });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
});

app.delete(`/deleteFromCart`, async (req, res) => {
  try {
    const { userID, productID } = req.body;
    if (!userID || !productID) {
      return res.json({ success: false, message: "Invalid input" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const updatedCart = user.cart.filter(
      (product) => product.productID.toString() !== productID
    );

    if (updatedCart.length === user.cart.length) {
      return res.json({
        success: false,
        message: "Product not found in cart",
      });
    }

    user.cart = updatedCart;
    await user.save();

    return res.json({
      success: true,
      message: "Product removed from cart",
      cart: user.cart,
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
});

app.get("/getCart/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const user = await User.findById(userID).populate("cart.productID");

    if (!user) {
      return res.json({ success: false, message: "no user found" });
    }

    const cart = user.cart;

    if (!cart.length) {
      return res.json({
        success: true,
        message: "The cart is empty",
        cart: [],
      });
    }

    res.json({ success: true, cart });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }

});


app.put("/updateCount", async (req, res) => {
  try {
    const { userID, productID, newCount } = req.body;
    if (!productID || !userID) {
      return res.json({ success: false, message: "Invalid input" });
    }
    const user = await User.findById(userID);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    const userCart = user.cart;
    if (!userCart) {
      return res.json({ success: false, message: "Cart not found" });
    }
    if (!user.cart || user.cart.length === 0) {
      return res.json({ success: false, message: "No products in cart" });
    }

    const product = await Product.findById(productID);
    const stock = product.stock;

    if (newCount > stock) {
      return res.json({
        success: false,
        message: "Product count exceeds stock",
      });
    }
    if (newCount <= 0) {
      return res.json({
        success: false,
        message: "Product count can't be less than 0",
      });
    }

    let isProductFound = false;

    user.cart = user.cart.map((item) => {
      if (item.productID.toString() === productID) {
        item.count = newCount;
        isProductFound = true;
      }
      return item;
    });

    if (!isProductFound) {
      return res.json({ success: false, message: "product not found" });
    }

    await user.save();
    return res.json({
      success: true,
      message: "Cart updated successfully",
      cart: user.cart,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.post(`/order`, async (req, res) => {
  try {
    const { userID } = req.body;
    if (!userID) {
      return res.json({ success: false, message: "User not found" });
    }
    const user = await User.findById(userID);

    const userCart = user.cart;
    if (!userCart) {
      return res.json({ success: false, message: "Cart not found" });
    }
    const productINFO = userCart;
    if (!productINFO) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const productsIDs = productINFO.map((item) => item.productID);
    const products = await Product.find({ _id: { $in: productsIDs } });

    let totalPrice = 0;
    productINFO.forEach((item) => {
      const product = products.find(
        (product) => product._id.toString() === item.productID.toString()
      );
      if (product) {
        totalPrice += product.price * item.count;
      }
    });

    const order = new Order({
      userID,
      products: productINFO,
      status: "pending",
      totalPrice,
    });

    await order.save();
    user.cart = [];
    await user.save();

    return res.json({
      success: true,
      message: "Order in the way",
      order: order,
    });
  } catch (err) {
    return res.json({ success: false, message: "Something went wrong" });
  }
});

app.get(`/userOrder/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ userID: id });
    if (!orders) {
      return res.json({ success: false, message: "there are no orders yet" });
    }
    res.json({ success: true, orders });
  } catch (err) {
    return res.json({ success: false, message: "Something went wrong" });
  }
});

app.get(`/allOrders`, async (req, res) => {
  try {
    const allOrders = await Order.find();
    if (!allOrders.length) {
      return res.json({ success: false, message: "there are no orders yet" });
    }
    res.json(allOrders);
  } catch (err) {
    return res.json({ success: false, message: "Something went wrong" });
  }
});

app.get(`/order/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.json({
        success: false,
        message: "there is no order with this id",
      });
    }
    res.json({ success: true, order });
  } catch (err) {
    return res.json({ success: false, message: "Something went wrong" });
  }
});

app.patch(`/acceptOrder/:orderID`, async (req, res) => {
  try {
    const { orderID } = req.params;
    const order = await Order.findById(orderID);
    if (!order) {
      return res.json({
        success: false,
        message: "there is no order with this id",
      });
    }
    const productINFO = order.products;

    const productsIDs = productINFO.map((item) => item.productID);
    const products = await Product.find({ _id: { $in: productsIDs } });

    for (const item of productINFO) {
      const product = products.find(
        (product) => product._id.toString() === item.productID.toString()
      );
      if (product.soldOut) {
        return res.json({
          success: false,
          message: "this product is sold out and cannot be accepted",
        });
      }
      if (product) {
        product.stock -= item.count;
        order.status = "accepted";
        if (product.stock === 0) product.soldOut = true;
        await product.save();
      }
    }
    await order.save();
    res.json({ success: true, message: "Order accepted", products });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.patch(`/rejectOrder/:orderID`, async (req, res) => {
  try {
    const { orderID } = req.params;
    const order = await Order.findById(orderID);
    if (!order) {
      return res.json({
        success: false,
        message: "there is no order with this id",
      });
    }
    order.status = "rejected";
    await order.save();
    res.json({ success: true, message: "Order rejected" });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.patch(`/cancelOrder/:orderID`, async (req, res) => {
  try {
    const { orderID } = req.params;
    const order = await Order.findById(orderID);
    if (!order) {
      return res.json({
        success: false,
        message: "there is no order with this id",
      });
    }
    order.status = "canceled";
    await order.save();
    res.json({ success: true, message: "Order canceled" });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.delete(`/order/:orderID`, async (req, res) => {
  try {
    const { orderID } = req.params;
    const order = await Order.findById(orderID);
    if (!order) {
      return res.json({
        success: false,
        message: "there is no order with this id",
      });
    }
    if (order.status === "pending") {
      return res.json({
        success: false,
        message: "cannot delete order in pending status",
      });
    }
    const deletedOrder = await Order.findByIdAndDelete(orderID);
    if (!deletedOrder) {
      return res.json({ success: false, message: "order is already deleted" });
    }
    res.json({ success: true, message: "order has been deleted" });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.get("/", (req, res) => {
  res.send("hello world");
});


app.listen(process.env.SERVER_PORT || 5000, () => {
  console.log('Server Started PORT ==> ', process.env.SERVER_PORT);
});
