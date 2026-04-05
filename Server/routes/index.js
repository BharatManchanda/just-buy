// routes/index.js
const express = require('express');
const productRoutes = require('./product'); // Ensure correct path to product.js
const cartRoutes = require('./cart'); // Ensure correct path to product.js
const adminRoutes = require('./admin'); // Ensure correct path to auth.js
const homeRoutes = require('./home'); // Ensure correct path to auth.js
const addressRoutes = require('./addressRoutes'); // Ensure correct path to auth.js
const razorpayRoutes = require('./razorpayRoutes'); // Ensure correct path to auth.js
const orderRoutes = require('./orderRoutes'); // Ensure correct path to auth.js
const { getProductById } = require('../controllers/home/home');
const { handleLoginWithOtp, sentLoginOtp, handleGetMe } = require('../controllers/auth/auth');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Correctly use .use for middleware-like routing
router.use("/category", authMiddleware, productRoutes);
router.use("/cart", cartRoutes);
router.use("/admin", adminRoutes);
router.use("/login", handleLoginWithOtp)
router.use("/me", authMiddleware, handleGetMe )
router.use("/sent-otp", sentLoginOtp)
router.get("/product/:id", getProductById)
router.use("/home", homeRoutes)
router.use("/address",authMiddleware, addressRoutes)
router.use("/payment",authMiddleware, razorpayRoutes)
router.use("/orders",authMiddleware, orderRoutes)


module.exports = router;
