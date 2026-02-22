import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../models/product.js';
import ProductCategory from '../models/productCategory.js';
import { getImage } from '../utils/unsplash.js';

const MONGO_URI = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/mydb';

// --- Main categories (existing + new) ---
const categories = [
  { name: 'Fruits & Vegetables', query: 'fresh fruits vegetables' },
  { name: 'Dairy & Bakery', query: 'milk cheese bread' },
  { name: 'Beverages', query: 'tea coffee juices' },
  { name: 'Snacks & Munchies', query: 'chips namkeen popcorn' },
  { name: 'Personal Care', query: 'skincare haircare hygiene' },
  { name: 'Pet Care', query: 'dog cat food' },
  { name: 'Baby Care', query: 'baby diapers wipes formula' },
  { name: 'Home & Cleaning', query: 'cleaning supplies detergents' },
  { name: 'Meat, Fish & Eggs', query: 'chicken fish eggs meat' }
];

// --- Subcategories (existing + new) ---
const subcategories = {
  'Fruits & Vegetables': [
    { name: 'Fresh Fruits', query: 'apples bananas grapes' },
    { name: 'Leafy Greens', query: 'spinach lettuce kale' },
    { name: 'Root Vegetables', query: 'carrots potatoes beetroot' }
  ],
  'Dairy & Bakery': [
    { name: 'Milk & Yogurt', query: 'milk yogurt' },
    { name: 'Cheese & Butter', query: 'cheese butter cottage cheese' },
    { name: 'Breads & Pastries', query: 'bread croissant bagel' }
  ],
  'Beverages': [
    { name: 'Tea & Coffee', query: 'tea coffee' },
    { name: 'Juices & Smoothies', query: 'orange juice apple juice' }
  ],
  'Snacks & Munchies': [
    { name: 'Chips & Namkeen', query: 'chips namkeen' },
    { name: 'Chocolate & Candies', query: 'chocolates candies' }
  ],
  'Personal Care': [
    { name: 'Hair Care', query: 'shampoo conditioner hair oil' },
    { name: 'Skin Care', query: 'face cream lotion sunscreen' }
  ],
  'Pet Care': [
    { name: 'Dog Food', query: 'dog food treats' },
    { name: 'Cat Food', query: 'cat food treats' }
  ],
  'Baby Care': [
    { name: 'Diapers & Wipes', query: 'baby diapers wipes' },
    { name: 'Baby Food', query: 'formula baby cereals' }
  ],
  'Home & Cleaning': [
    { name: 'Cleaning Supplies', query: 'detergent mop scrub' },
    { name: 'Kitchen Essentials', query: 'sponges dish soap utensils' }
  ],
  'Meat, Fish & Eggs': [
    { name: 'Fresh Meat', query: 'chicken mutton beef' },
    { name: 'Seafood', query: 'fish prawns crabs' },
    { name: 'Eggs', query: 'chicken eggs duck eggs' }
  ]
};

// --- Products (existing + new) ---
const productsBySubcategory = {
  // Fruits & Veg
  'Fresh Fruits': ['Apple', 'Banana', 'Grapes', 'Mango', 'Orange'],
  'Leafy Greens': ['Spinach', 'Lettuce', 'Kale', 'Coriander', 'Mint'],
  'Root Vegetables': ['Carrot', 'Potato', 'Beetroot', 'Radish', 'Turnip'],

  // Dairy & Bakery
  'Milk & Yogurt': ['Full Cream Milk', 'Greek Yogurt', 'Low Fat Milk', 'Paneer'],
  'Cheese & Butter': ['Cheddar Cheese', 'Butter', 'Cottage Cheese', 'Mozzarella'],
  'Breads & Pastries': ['Whole Wheat Bread', 'Croissant', 'Bagel', 'Buns'],

  // Beverages
  'Tea & Coffee': ['Green Tea', 'Black Coffee', 'Herbal Tea', 'Espresso'],
  'Juices & Smoothies': ['Orange Juice', 'Apple Juice', 'Mango Smoothie', 'Carrot Juice'],

  // Snacks & Munchies
  'Chips & Namkeen': ['Potato Chips', 'Mixed Namkeen', 'Corn Chips', 'Popcorn'],
  'Chocolate & Candies': ['Milk Chocolate', 'Dark Chocolate', 'Gummy Bears', 'Lollipops'],

  // Personal Care
  'Hair Care': ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Mask'],
  'Skin Care': ['Face Cream', 'Body Lotion', 'Sunscreen', 'Face Wash'],

  // Pet Care
  'Dog Food': ['Pedigree Dog Food', 'Dog Treats', 'Dog Biscuits'],
  'Cat Food': ['Whiskas Cat Food', 'Cat Treats', 'Catnip Toys'],

  // Baby Care
  'Diapers & Wipes': ['Pampers Diapers', 'Huggies Wipes', 'Baby Dry Diapers'],
  'Baby Food': ['Infant Formula', 'Baby Cereal', 'Baby Porridge'],

  // Home & Cleaning
  'Cleaning Supplies': ['Detergent Powder', 'Dish Soap', 'Mop', 'Scrub'],
  'Kitchen Essentials': ['Sponges', 'Utensils', 'Cutting Board', 'Storage Containers'],

  // Meat, Fish & Eggs
  'Fresh Meat': ['Chicken', 'Mutton', 'Beef', 'Pork'],
  'Seafood': ['Fish', 'Prawns', 'Crabs', 'Squid'],
  'Eggs': ['Chicken Eggs', 'Duck Eggs', 'Quail Eggs']
};

// --- Utility functions ---
const getRandomPrice = () => parseFloat((Math.random() * 10 + 5).toFixed(2));
const getRandomDiscount = () => Math.floor(Math.random() * 25);
const getRandomStock = () => Math.floor(Math.random() * 100) + 10;

// --- Seeder function ---
const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear old data
    await Product.deleteMany({});
    await ProductCategory.deleteMany({});
    console.log('🧹 Old data cleared');

    // Seed main categories
    const categoryDocs = {};
    for (const cat of categories) {
      const imageUrl = await getImage(cat.query);
      const doc = await ProductCategory.create({
        name: cat.name,
        imageUrl,
        parentCategory: null
      });
      categoryDocs[cat.name] = doc;
    }
    console.log('📁 Categories seeded');

    // Seed subcategories
    const subCategoryDocs = {};
    for (const [parentName, subs] of Object.entries(subcategories)) {
      for (const sub of subs) {
        const imageUrl = await getImage(sub.query);
        const doc = await ProductCategory.create({
          name: sub.name,
          imageUrl,
          parentCategory: categoryDocs[parentName]._id
        });
        subCategoryDocs[sub.name] = doc;
      }
    }
    console.log('📁 Subcategories seeded');

    // Seed products
    const products = [];
    for (const [subName, productNames] of Object.entries(productsBySubcategory)) {
      const subCat = subCategoryDocs[subName];
      for (const prodName of productNames) {
        const imageUrl = await getImage(prodName);
        products.push({
          name: prodName,
          imageUrl,
          price: getRandomPrice(),
          discount: getRandomDiscount(),
          stock: getRandomStock(),
          category_id: subCat._id
        });
      }
    }

    await Product.insertMany(products);
    console.log('🛒 Products seeded');

    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    await mongoose.disconnect();
  }
};

seedData();