const express = require('express');
const router = express.Router();
const {
  getHome,
  getCategoryProducts,
  getCategories,
  searchProducts,
  getSearchSuggestions,
  getProductById,
} = require('../controllers/home/home');

// Home data (nested categories, subcategories, and summary)
router.get("/", getHome);

// Get products for a specific category (parent or sub)
router.get("/category/:id", getCategoryProducts);
router.get("/categories", getCategories);
router.get("/product/:id", getProductById);
router.get('/search', searchProducts);
router.get('/search/suggestions', getSearchSuggestions);

module.exports = router;
