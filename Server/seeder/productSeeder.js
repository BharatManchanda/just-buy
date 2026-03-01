import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "../models/product.js";
import ProductCategory from "../models/productCategory.js";

const MONGO_URI = process.env.CONNECTION_STRING || "mongodb://localhost:27017/mydb";

// --- Main categories (existing + new) ---
const categories = [
  {
    name: 'Fruits & Vegetables',
    slug: 'fresh-fruits-vegetables',
    description: 'Fresh and organic fruits and vegetables sourced directly from farms.',
    imageUrl: '/uploads/categories/fruits-vegetables.png'
  },
  {
    name: 'Dairy & Bakery',
    slug: 'dairy-bakery',
    description: 'Dairy products and baked goods made with high-quality ingredients.',
    imageUrl: '/uploads/categories/dairy-bakery.png'
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'A wide range of refreshing drinks, including juices, sodas, and more.',
    imageUrl: '/uploads/categories/beverages.png'
  },
  {
    name: 'Snacks & Munchies',
    slug: 'snacks-munchies',
    description: 'Tasty snacks and munchies for every craving.',
    imageUrl: '/uploads/categories/snacks-munchies.png'
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Essential personal care products for your daily routine.',
    imageUrl: '/uploads/categories/personal-care.png'
  },
  {
    name: 'Pet Care',
    slug: 'pet-care',
    description: 'Quality food and care products for your beloved pets.',
    imageUrl: '/uploads/categories/pet-care.png'
  },
  {
    name: 'Baby Care',
    slug: 'baby-care',
    description: 'Safe and gentle products for your little ones.',
    imageUrl: '/uploads/categories/baby-care.png'
  },
  {
    name: 'Home & Cleaning',
    slug: 'home-cleaning',
    description: 'Effective cleaning supplies for a spotless home.',
    imageUrl: '/uploads/categories/home-cleaning.png'
  },
  {
    name: 'Meat, Fish & Eggs',
    slug: 'meat-fish-eggs',
    description: 'Fresh and high-quality meat, fish, and eggs.',
    imageUrl: '/uploads/categories/meat-fish-eggs.png'
  },
  {
    name: 'Organic & Health Living',
    slug: 'organic-health-living',
    description: 'Products to support your health and wellness journey.',
    imageUrl: '/uploads/categories/organic-health-living.png'
  },
  {
    name: "Pharmacy & Wellness",
    slug: 'pharmacy-wellness',
    description: 'Medicines, supplements, and wellness products for your health.',
    imageUrl: '/uploads/categories/pharmacy-wellness.png',
  },
  {
    name: "Tea Coffee & Milk Drinks",
    slug: 'tea-coffee-milk-drinks',
    description: 'A variety of teas, coffees, and milk-based beverages.',
    imageUrl: '/uploads/categories/tea-coffee-milk-drinks.png',
  },
  {
    name: "Bakery & Biscuits",
    slug: 'bakery-biscuits',
    description: 'Freshly baked goods and a variety of biscuits.',
    imageUrl: '/uploads/categories/bakery-biscuits.png',
  },
  {
    name: "Cold Drinks & Juices",
    slug: 'cold-drinks-juices',
    description: 'Refreshing cold drinks and a variety of juices.',
    imageUrl: '/uploads/categories/cold-drinks-juices.png',
  },
  {
    name: "Sweets & Desserts",
    slug: 'sweets-desserts',
    description: 'Delicious sweets and desserts for every occasion.',
    imageUrl: '/uploads/categories/sweets-desserts.png',
  },
  {
    name: "Atta, Rice & Dal",
    slug: 'atta-rice-dal',
    description: 'Staple grains and pulses for your daily meals.',
    imageUrl: '/uploads/categories/atta-rice-dal.png',
  },
  {
    name: "Breakfast & Cereal",
    slug: 'breakfast-cereal',
    description: 'Start your day with our range of breakfast cereals and foods.',
    imageUrl: '/uploads/categories/breakfast-cereal.png',
  },
  {
    name: "Sauce & Spreads",
    slug: 'sauce-spreads',
    description: 'A variety of sauces and spreads to enhance your meals.',
    imageUrl: '/uploads/categories/sauce-spreads.png',
  },
  {
    name: "Masala & Cooking Needs",
    slug: 'masala-cooking-needs',
    description: 'Essential spices and cooking ingredients for your kitchen.',
    imageUrl: '/uploads/categories/masala-cooking-needs.png',
  },
  {
    name: "Home & Office Needs",
    slug: 'home-office-needs',
    description: 'Supplies for your home and office needs.',
    imageUrl: '/uploads/categories/home-office-needs.png',
  }
];

// --- Subcategories (existing + new) ---
const subcategories = {
  'Fruits & Vegetables': [
    { name: 'Fresh Fruits', slug: 'fresh-fruits', description: 'A variety of fresh and seasonal fruits.', imageUrl: '/uploads/categories/fresh-fruits.png' },
    { name: 'Fresh Vegetables', slug: 'fresh-vegetables', description: 'A selection of fresh and organic vegetables.', imageUrl: '/uploads/categories/fresh-vegetables.png' },
    { name: 'Leafy Greens', slug: 'leafy-greens', description: 'Nutritious leafy greens for salads and cooking.', imageUrl: '/uploads/categories/leafy-greens.png' },
    { name: 'Root Vegetables', slug: 'root-vegetables', description: 'Hearty root vegetables for various dishes.', imageUrl: '/uploads/categories/root-vegetables.png' }
  ],
  'Dairy & Bakery': [
    { name: 'Milk & Yogurt', slug: 'milk-yogurt', description: 'Dairy products for a healthy diet.', imageUrl: '/uploads/categories/milk-yogurt.png' },
    { name: 'Cheese & Butter', slug: 'cheese-butter', description: 'Rich and creamy cheese and butter.', imageUrl: '/uploads/categories/cheese-butter.png' },
    { name: 'Breads & Pastries', slug: 'breads-pastries', description: 'Freshly baked breads and pastries.', imageUrl: '/uploads/categories/breads-pastries.png' }
  ],
  'Beverages': [
    { name: 'Tea & Coffee', slug: 'tea-coffee', description: 'A variety of teas and coffees.', imageUrl: '/uploads/categories/tea-coffee.png' },
    { name: 'Juices & Smoothies', slug: 'juices-smoothies', description: 'Refreshing juices and smoothies.', imageUrl: '/uploads/categories/juices-smoothies.png' }
  ],
  'Snacks & Munchies': [
    { name: 'Chips & Namkeen', slug: 'chips-namkeen', description: 'Crispy chips and savory snacks.', imageUrl: '/uploads/categories/chips-namkeen.png' },
    { name: 'Chocolate & Candies', slug: 'chocolate-candies', description: 'Delicious chocolates and candies.', imageUrl: '/uploads/categories/chocolate-candies.png' }
  ],
  'Personal Care': [
    { name: 'Hair Care', slug: 'hair-care', description: 'Shampoo, conditioner, and hair styling products.', imageUrl: '/uploads/categories/hair-care.png' },
    { name: 'Skin Care', slug: 'skin-care', description: 'Moisturizers, cleansers, and skincare treatments.', imageUrl: '/uploads/categories/skin-care.png' }
  ],
  'Pet Care': [
    { name: 'Dog Food', slug: 'dog-food', description: 'Nutritious food and treats for dogs.', imageUrl: '/uploads/categories/dog-food.png' },
    { name: 'Cat Food', slug: 'cat-food', description: 'Healthy food and treats for cats.', imageUrl: '/uploads/categories/cat-food.png' }
  ],
  'Baby Care': [
    { name: 'Diapers & Wipes', slug: 'diapers-wipes', description: 'Essential diapers and wipes for babies.', imageUrl: '/uploads/categories/diapers-wipes.png' },
    { name: 'Baby Food', slug: 'baby-food', description: 'Nutritious food options for babies.', imageUrl: '/uploads/categories/baby-food.png' }
  ],
  'Home & Cleaning': [
    { name: 'Cleaning Supplies', slug: 'cleaning-supplies', description: 'Effective cleaning supplies for a spotless home.', imageUrl: '/uploads/categories/cleaning-supplies.png' },
    { name: 'Kitchen Essentials', slug: 'kitchen-essentials', description: 'Must-have items for every kitchen.', imageUrl: '/uploads/categories/kitchen-essentials.png' }
  ],
  'Meat, Fish & Eggs': [
    { name: 'Fresh Meat', slug: 'fresh-meat', description: 'High-quality fresh meat for your meals.', imageUrl: '/uploads/categories/fresh-meat.png' },
    { name: 'Seafood', slug: 'seafood', description: 'Fresh and delicious seafood options.', imageUrl: '/uploads/categories/seafood.png' },
    { name: 'Eggs', slug: 'eggs', description: 'Farm-fresh eggs for your breakfast.', imageUrl: '/uploads/categories/eggs.png' }
  ]
};

// --- Products (existing + new) ---
const productsBySubcategory = {
  // Fruits & Veg
  'Fresh Fruits': [
    {
      name: "Hydroponic Sweet Bell Pepper (Cocktail)",
      slug: "hydroponic-sweet-bell-pepper-cocktail",
      imageUrl: ["/uploads/products/hydroponic-sweet-bell-pepper-cocktail.png"],
      price: 158,
      mrp: 199,
      description: "Hydroponically grown sweet bell pepper — fresh and crisp.",
      discount: 21,
      unit: "200 g", stock: 50, status: "active"
    },
    { name: "Coriander Bunch (Dhaniya Patta)", slug: "coriander-bunch-dhaniya-patta", imageUrl: ["/uploads/products/coriander-bunch-dhaniya-patta.png"], price: 1, mrp: 7, description: "Fresh coriander bunch, perfect for garnishing and flavour.", discount: 86, unit: "100 g", stock: 100, status: "active" },
    { name: "Onion (Pyaz)", slug: "onion-pyaz", imageUrl: ["/uploads/products/onion-pyaz.png"], price: 29, mrp: 36, description: "Fresh onions — essential for everyday cooking.", discount: 19, unit: "1 kg", stock: 100, status: "active" },
    { name: "Portion Pumpkin", slug: "portion-pumpkin", imageUrl: ["/uploads/products/portion-pumpkin.png"], price: 60, mrp: 72, description: "Seasonal pumpkin portion — rich in nutrients.", discount: 17, unit: "500 g", stock: 60, status: "active" },
  ],
  'Leafy Greens': [
    {
      name: "Betel Leaves (Paan Patta)",
      slug: "betel-leaves-paan-patta",
      imageUrl: ["/uploads/products/betel-leaves-paan-patta.png"],
      price: 19,
      mrp: 22,
      description: "Fresh betel leaves — used for traditional paan and cooking.",
      discount: Math.round(((22 - 19) / 22) * 100),
      unit: "5 pcs",
      stock: 60,
      status: "active"
    },
    {
      name: "Coriander (Without Roots) (Dhaniya)",
      slug: "coriander-without-roots-dhaniya",
      imageUrl: ["/uploads/products/coriander-without-roots-dhaniya.png"],
      price: 19,
      mrp: 24,
      description: "Coriander leaves without roots — less prep time.",
      discount: Math.round(((24 - 19) / 24) * 100),
      unit: "100 g",
      stock: 80,
      status: "active"
    },
    {
      name: "Curry Leaves (Kadi Patta)",
      slug: "curry-leaves-kadi-patta",
      imageUrl: ["/uploads/products/curry-leaves-kadi-patta.png"],
      price: 28,
      mrp: 33,
      description: "Fresh curry leaves — perfect for tempering and South Indian cooking.",
      discount: Math.round(((33 - 28) / 33) * 100),
      unit: "50 g",
      stock: 70,
      status: "active"
    },
    {
      name: "Iceberg Lettuce",
      slug: "iceberg-lettuce",
      imageUrl: ["/uploads/products/iceberg-lettuce.png"],
      price: 41,
      mrp: 50,
      description: "Crispy iceberg lettuce — great for salads and wraps.",
      discount: Math.round(((50 - 41) / 50) * 100),
      unit: "250 g",
      stock: 60,
      status: "active"
    }
  ],
  'Root Vegetables': [
    {
      name: 'Carrot',
      slug: 'carrot',
      imageUrl: ['/uploads/products/carrot.png'],
      price: 40,
      mrp: 50,
      description: 'Fresh and organic carrots directly from the farm.',
      discount: Math.round(((50 - 40) / 50) * 100), // 20% discount
      unit: '1 kg',
      stock: 100,
      status: 'active'
    },
    {
      name: 'Potato',
      slug: 'potato',
      imageUrl: ['/uploads/products/potato.png'],
      price: 25,
      mrp: 30,
      description: 'Fresh potatoes — perfect for daily cooking.',
      discount: Math.round(((30 - 25) / 30) * 100), // 17% discount
      unit: '1 kg',
      stock: 120,
      status: 'active'
    },
    {
      name: 'Beetroot',
      slug: 'beetroot',
      imageUrl: ['/uploads/products/beetroot.png'],
      price: 35,
      mrp: 42,
      description: 'Fresh beetroot — rich in nutrients and flavor.',
      discount: Math.round(((42 - 35) / 42) * 100), // 17% discount
      unit: '1 kg',
      stock: 80,
      status: 'active'
    },
    {
      name: 'Radish',
      slug: 'radish',
      imageUrl: ['/uploads/products/radish.png'],
      price: 20,
      mrp: 25,
      description: 'Fresh radishes — crispy and healthy for salads.',
      discount: Math.round(((25 - 20) / 25) * 100), // 20% discount
      unit: '1 kg',
      stock: 90,
      status: 'active'
    },
    {
      name: 'Turnip',
      slug: 'turnip',
      imageUrl: ['/uploads/products/turnip.png'],
      price: 30,
      mrp: 36,
      description: 'Fresh turnips — ideal for cooking and stews.',
      discount: Math.round(((36 - 30) / 36) * 100), // 17% discount
      unit: '1 kg',
      stock: 70,
      status: 'active'
    }
  ],

  'Milk & Yogurt': [
    {
      name: "Brooke Bond Red Label Tea - 250 g",
      slug: "brooke-bond-red-label-tea-250g",
      imageUrl: ["/uploads/products/brooke-bond-red-label-tea-250g.png"],
      price: 120,
      mrp: 140,
      description: "Classic black tea from Brooke Bond — strong flavour for daily cuppas.",
      discount: Math.round(((140 - 120) / 140) * 100),
      unit: "250 g",
      stock: 100,
      status: "active"
    },
    {
      name: "Brooke Bond Red Label Tea - 100 g",
      slug: "brooke-bond-red-label-tea-100g",
      imageUrl: ["/uploads/products/brooke-bond-red-label-tea-100g.png"],
      price: 45,
      mrp: 55,
      description: "Smaller pack of Brooke Bond Red Label tea perfect for trials.",
      discount: Math.round(((55 - 45) / 55) * 100),
      unit: "100 g",
      stock: 70,
      status: "active"
    },
    {
      name: "Brooke Bond Red Label Natural Care Tea",
      slug: "brooke-bond-red-label-natural-care-tea",
      imageUrl: ["/uploads/products/brooke-bond-red-label-natural-care-tea.png"],
      price: 160,
      mrp: 185,
      description: "Natural Care tea variant from Brooke Bond — smooth taste.",
      discount: Math.round(((185 - 160) / 185) * 100),
      unit: "250 g",
      stock: 50,
      status: "active"
    },
    {
      name: "Wagh Bakri Premium Leaf Tea (250 g)",
      slug: "wagh-bakri-premium-leaf-tea-250g",
      imageUrl: ["/uploads/products/wagh-bakri-premium-leaf-tea-250g.png"],
      price: 165,
      mrp: 190,
      description: "Premium leaf tea from Wagh Bakri for a rich brew.",
      discount: Math.round(((190 - 165) / 190) * 100),
      unit: "250 g",
      stock: 60,
      status: "active"
    },
    {
      name: "Society Elaichi Instant Tea Premix",
      slug: "society-elaichi-instant-tea-premix",
      imageUrl: ["/uploads/products/society-elaichi-instant-tea-premix.png"],
      price: 100,
      mrp: 135,
      description: "Cardamom flavoured instant tea mix for quick chai.",
      discount: Math.round(((135 - 100) / 135) * 100),
      unit: "140 g",
      stock: 50,
      status: "active"
    }
  ],
  'Cheese & Butter': [
    {
      name: "D'lecta 100% Mozzarella Pizza Cheese Block",
      slug: "dlecta-100-mozzarella-pizza-cheese-block",
      imageUrl: ["/uploads/products/dlecta-mozzarella.png"],
      price: 120,
      mrp: 155,
      description: "D'lecta 100% Mozzarella Pizza Cheese Block — perfect for baking and pizzas.",
      discount: Math.round(((155 - 120) / 155) * 100),
      unit: "200 g",
      stock: 80,
      status: "active"
    },
    {
      name: "Amul Cheese Block",
      slug: "amul-cheese-block",
      imageUrl: ["/uploads/products/amul-cheese-block.png"],
      price: 290,
      mrp: 290,
      description: "Amul Cheese Block — classic everyday cheese block.",
      discount: 0,
      unit: "500 g",
      stock: 60,
      status: "active"
    },
    {
      name: "D'lecta 100% Cheddar Cheese Block",
      slug: "dlecta-100-cheddar-cheese-block",
      imageUrl: ["/uploads/products/dlecta-cheddar.png"],
      price: 185,
      mrp: 199,
      description: "D'lecta Cheddar Cheese Block — rich and sharp flavour.",
      discount: Math.round(((199 - 185) / 199) * 100),
      unit: "200 g",
      stock: 70,
      status: "active"
    },
    {
      name: "Amul Pizza Mozzarella Cheese Block",
      slug: "amul-pizza-mozzarella-cheese-block",
      imageUrl: ["/uploads/products/amul-pizza-mozzarella.png"],
      price: 117,
      mrp: 117,
      description: "Amul Pizza Mozzarella Cheese Block — ideal for pizza toppings.",
      discount: 0,
      unit: "200 g",
      stock: 80,
      status: "active"
    },
    {
      name: "Amul A+ Cheese Slices",
      slug: "amul-a-plus-cheese-slices",
      imageUrl: ["/uploads/products/amul-a-plus-slices.png"],
      price: 170,
      mrp: 181,
      description: "Amul A+ Cheese Slices — ready to use in sandwiches and burgers.",
      discount: Math.round(((181 - 170) / 181) * 100),
      unit: "200 g",
      stock: 90,
      status: "active"
    }
  ],
  'Breads & Pastries': [
    {
      name: "Harvest Gold White Bread",
      slug: "harvest-gold-white-bread",
      imageUrl: ["/uploads/products/harvest-gold-white-bread.png"],
      price: 30,
      mrp: 40,
      description: "Soft and classic Harvest Gold white bread — perfect for sandwiches and toast.",
      discount: Math.round(((40 - 30) / 40) * 100),
      unit: "400 g",
      stock: 80,
      status: "active"
    },
    {
      name: "Harvest Gold 100% Atta Whole Wheat Bread",
      slug: "harvest-gold-100-atta-whole-wheat-bread",
      imageUrl: ["/uploads/products/harvest-gold-atta-bread.png"],
      price: 57,
      mrp: 65,
      description: "100% whole wheat bread by Harvest Gold — nutritious and tasty.",
      discount: Math.round(((65 - 57) / 65) * 100),
      unit: "450 g",
      stock: 70,
      status: "active"
    },
    {
      name: "English Oven Zero Maida 100% Whole Wheat Bread",
      slug: "english-oven-zero-maida-100-whole-wheat-bread",
      imageUrl: ["/uploads/products/english-oven-zero-maida-bread.png"],
      price: 55,
      mrp: 60,
      description: "Zero maida whole wheat bread — healthier option with high fibre.",
      discount: Math.round(((60 - 55) / 60) * 100),
      unit: "400 g",
      stock: 75,
      status: "active"
    },
    {
      name: "English Oven Brown Bread",
      slug: "english-oven-brown-bread",
      imageUrl: ["/uploads/products/english-oven-brown-bread.png"],
      price: 55,
      mrp: 65,
      description: "Brown bread with fibre — great for everyday sandwiches and toast.",
      discount: Math.round(((65 - 55) / 65) * 100),
      unit: "400 g",
      stock: 70,
      status: "active"
    },
    {
      name: "Protein Chef Multigrain Double Protein Bread",
      slug: "protein-chef-multigrain-double-protein-bread",
      imageUrl: ["/uploads/products/protein-chef-multigrain-bread.png"],
      price: 99,
      mrp: 110,
      description: "High protein multigrain bread — ideal for fitness-oriented meals.",
      discount: Math.round(((110 - 99) / 110) * 100),
      unit: "Loaf",
      stock: 60,
      status: "active"
    }
  ],

  // Beverages
  'Tea & Coffee': [
    {
      name: "Tata Tea Agni Special Blend Tea",
      slug: "tata-tea-agni-special-blend-tea",
      imageUrl: ["/uploads/products/tata-tea-agni.png"],
      price: 65,
      mrp: 75,
      description: "Blended tea for everyday strong flavour.",
      discount: Math.round(((75 - 65) / 75) * 100),
      unit: "250 g",
      stock: 90,
      status: "active"
    },
    {
      name: "Brooke Bond Red Label Tea",
      slug: "brooke-bond-red-label-tea",
      imageUrl: ["/uploads/products/brooke-bond-red-label.png"],
      price: 45,
      mrp: 55,
      description: "Classic black tea from Brooke Bond — everyday favourite.",
      discount: Math.round(((55 - 45) / 55) * 100),
      unit: "100 g",
      stock: 80,
      status: "active"
    },
    {
      name: "Society Masala Instant Tea Premix",
      slug: "society-masala-instant-tea-premix",
      imageUrl: ["/uploads/products/society-masala-tea.png"],
      price: 100,
      mrp: 135,
      description: "Instant tea premix with masala flavour — quick and spicy.",
      discount: Math.round(((135 - 100) / 135) * 100),
      unit: "140 g",
      stock: 80,
      status: "active"
    },
    {
      name: "Tata Tea Premium Tea (Mini Pack)",
      slug: "tata-tea-premium-tea-mini-pack",
      imageUrl: ["/uploads/products/tata-tea-premium-mini.png"],
      price: 40,
      mrp: 50,
      description: "Mini 100g pack of Tata Tea Premium — perfect small size.",
      discount: Math.round(((50 - 40) / 50) * 100),
      unit: "100 g",
      stock: 90,
      status: "active"
    },
    {
      name: "Tata Tea Gold",
      slug: "tata-tea-gold",
      imageUrl: ["/uploads/products/tata-tea-gold.png"],
      price: 324,
      mrp: 360,
      description: "Tata Tea Gold — bold and full-bodied tea.",
      discount: Math.round(((360 - 324) / 360) * 100),
      unit: "500 g",
      stock: 50,
      status: "active"
    },
  ],
  'Juices & Smoothies': [
    {
      name: "Coca-Cola Soft Drink - 750 ml (Pack of 4)",
      slug: "coca-cola-soft-drink-750ml-pack-of-4",
      imageUrl: ["/uploads/products/coca-cola-4-pack.png"],
      price: 159,
      mrp: 160,
      description: "Classic Coca-Cola soft drink in a pack of four 750 ml bottles.",
      discount: Math.round(((160 - 159) / 160) * 100),
      unit: "4 x 750 ml",
      stock: 100,
      status: "active"
    },
    {
      name: "Thums Up Soft Drink 750 ml",
      slug: "thums-up-soft-drink-750ml",
      imageUrl: ["/uploads/products/thums-up-750ml.png"],
      price: 40,
      mrp: 40,
      description: "Strong and bold fizzy cola drink from Thums Up.",
      discount: 0,
      unit: "750 ml",
      stock: 120,
      status: "active"
    },
    {
      name: "Coca-Cola Diet Coke 300 ml",
      slug: "coca-cola-diet-coke-300ml",
      imageUrl: ["/uploads/products/diet-coke-300ml.png"],
      price: 40,
      mrp: 40,
      description: "Diet Coke — classic cola taste with zero sugar.",
      discount: 0,
      unit: "300 ml",
      stock: 90,
      status: "active"
    },
    {
      name: "Limca Lemon 'N' Lime Soft Drink 750 ml",
      slug: "limca-lemon-n-lime-soft-drink-750ml",
      imageUrl: ["/uploads/products/limca-750ml.png"],
      price: 39,
      mrp: 40,
      description: "Refreshingly zesty lemon & lime soft drink — Limca.",
      discount: Math.round(((40 - 39) / 40) * 100),
      unit: "750 ml",
      stock: 80,
      status: "active"
    },
    {
      name: "Sprite Lime Flavored Soft Drink 750 ml",
      slug: "sprite-lime-flavored-soft-drink-750ml",
      imageUrl: ["/uploads/products/sprite-750ml.png"],
      price: 40,
      mrp: 40,
      description: "Crisp lime-flavored Sprite — refreshing and caffeine-free.",
      discount: 0,
      unit: "750 ml",
      stock: 90,
      status: "active"
    }
  ],
  // Snacks & Munchies
  'Chips & Namkeen': [
    {
      name: "Lay's Wafer Potato Chips (Red Chilli)",
      slug: "lays-wafer-potato-chips-red-chilli",
      imageUrl: ["/uploads/products/lays-wafer-red-chilli.png"],
      price: 36,
      mrp: 48,
      description: "Crunchy Lay's wafer style potato chips with red chilli flavour.",
      discount: Math.round(((48 - 36) / 48) * 100),
      unit: "82 g",
      stock: 120,
      status: "active"
    },
    {
      name: "Lay's India’s Magic Masala Potato Chips",
      slug: "lays-indias-magic-masala-potato-chips",
      imageUrl: ["/uploads/products/lays-magic-masala.png"],
      price: 30,
      mrp: 50,
      description: "Lay's India’s Magic Masala — spicy and tangy masala chips.",
      discount: Math.round(((50 - 30) / 50) * 100),
      unit: "73.7 g",
      stock: 100,
      status: "active"
    },
    {
      name: "Uncle Chipps Spicy Treat Potato Chips",
      slug: "uncle-chipps-spicy-treat-potato-chips",
      imageUrl: ["/uploads/products/uncle-chipps-spicy-treat.png"],
      price: 39,
      mrp: 50,
      description: "Uncle Chipps Spicy Treat — classic spicy flavour.",
      discount: Math.round(((50 - 39) / 50) * 100),
      unit: "80 g",
      stock: 90,
      status: "active"
    },
    {
      name: "Pringles Scorchin’ Red Hot Chilli Chips",
      slug: "pringles-scorchin-red-hot-chilli-chips",
      imageUrl: ["/uploads/products/pringles-red-hot-chilli.png"],
      price: 50,
      mrp: 53,
      description: "Pringles Scorchin’ Red Hot Chilli — bold chilli potato crisps.",
      discount: Math.round(((53 - 50) / 53) * 100),
      unit: "40 g",
      stock: 70,
      status: "active"
    },
    {
      name: "Lay's West Indies Hot n Sweet Chilli Potato Chips",
      slug: "lays-west-indies-hot-n-sweet-chilli-potato-chips",
      imageUrl: ["/uploads/products/lays-west-indies-hotsweet.png"],
      price: 20,
      mrp: 20,
      description: "Lay's West Indies Hot n Sweet Chilli — spicy & sweet potato chips.",
      discount: 0,
      unit: "48 g",
      stock: 100,
      status: "active"
    },
  ],
  'Chocolate & Candies': [
    {
      name: "The Select Aisle Mini Marshmallow - Vegan",
      slug: "the-select-aisle-mini-marshmallow-vegan",
      imageUrl: ["/uploads/products/select-aisle-mini-marshmallow.png"],
      price: 69,
      mrp: 90,
      description: "Vegan mini marshmallows — sweet, fluffy treats for snacking and desserts.", 
      discount: Math.round(((90 - 69) / 90) * 100),
      unit: "20 g",
      stock: 150,
      status: "active"
    },
    {
      name: "Beanly Choco Hazelnut Spread with Breadsticks",
      slug: "beanly-choco-hazelnut-spread-with-breadsticks",
      imageUrl: ["/uploads/products/beanly-choco-hazelnut.png"],
      price: 99,
      mrp: 133,
      description: "Choco hazelnut spread with breadsticks — rich and nutty flavour.",
      discount: Math.round(((133 - 99) / 133) * 100),
      unit: "52 g",
      stock: 100,
      status: "active"
    },
    {
      name: "Beanly Mighty Coffee Spread with Breadsticks",
      slug: "beanly-mighty-coffee-spread-with-breadsticks",
      imageUrl: ["/uploads/products/beanly-coffee-spread.png"],
      price: 85,
      mrp: 133,
      description: "Coffee flavoured spread with breadsticks — perfect for quick snacks.",
      discount: Math.round(((133 - 85) / 133) * 100),
      unit: "52 g",
      stock: 100,
      status: "active"
    },
    {
      name: "E.Wedel Classic Milk Chocolate Bar",
      slug: "ewedel-classic-milk-chocolate-bar",
      imageUrl: ["/uploads/products/ewedel-classic-milk.png"],
      price: 297,
      mrp: 595,
      description: "Classic milk chocolate bar from E.Wedel — smooth, creamy chocolate.",
      discount: Math.round(((595 - 297) / 595) * 100),
      unit: "90 g",
      stock: 80,
      status: "active"
    },
    {
      name: "E.Wedel Espresso Filling Dark Chocolate Bar",
      slug: "ewedel-espresso-filling-dark-chocolate-bar",
      imageUrl: ["/uploads/products/ewedel-espresso-dark.png"],
      price: 297,
      mrp: 595,
      description: "Dark chocolate bar with espresso filling — rich and bold flavour.",
      discount: Math.round(((595 - 297) / 595) * 100),
      unit: "100 g",
      stock: 80,
      status: "active"
    }
  ],
  // Personal Care
  'Hair Care': [
    {
      name: "Parachute Advansed Gold Aloe Vera Hair Oil",
      slug: "parachute-advansed-gold-aloe-vera-hair-oil",
      imageUrl: ["/uploads/products/parachute-advansed-gold-hair-oil.png"],
      price: 227,
      mrp: 291,
      description: "Nourishing aloe vera enriched hair oil for stronger, healthier hair.",
      discount: Math.round(((291 - 227) / 291) * 100),
      unit: "400 ml",
      stock: 100,
      status: "active"
    },
    {
      name: "Parachute 100% Pure Coconut Hair Oil",
      slug: "parachute-100-pure-coconut-hair-oil",
      imageUrl: ["/uploads/products/parachute-coconut-hair-oil.png"],
      price: 194,
      mrp: 222,
      description: "Pure coconut oil for deep nourishment and smooth hair.",
      discount: Math.round(((222 - 194) / 222) * 100),
      unit: "300 ml",
      stock: 110,
      status: "active"
    },
    {
      name: "Patanjali Coconut Hair Oil",
      slug: "patanjali-coconut-hair-oil",
      imageUrl: ["/uploads/products/patanjali-coconut-hair-oil.png"],
      price: 135,
      mrp: 150,
      description: "Natural Patanjali coconut hair oil — traditional nourishment for hair.",
      discount: Math.round(((150 - 135) / 150) * 100),
      unit: "200 ml",
      stock: 90,
      status: "active"
    },
    {
      name: "Tresemme Keratin Smooth Shampoo",
      slug: "tresemme-keratin-smooth-shampoo",
      imageUrl: ["/uploads/products/tresemme-keratin-smooth-shampoo.png"],
      price: 172,
      mrp: 200,
      description: "Keratin Smooth Shampoo by Tresemme for silky, frizz-free hair.",
      discount: Math.round(((200 - 172) / 200) * 100),
      unit: "180 ml",
      stock: 120,
      status: "active"
    },
    {
      name: "L'Oreal Paris Hyaluron Moisture Conditioner",
      slug: "loreal-paris-hyaluron-moisture-conditioner",
      imageUrl: ["/uploads/products/loreal-hyaluron-conditioner.png"],
      price: 209,
      mrp: 299,
      description: "Hyaluron Moisture Conditioner for deep hydration and shine.",
      discount: Math.round(((299 - 209) / 299) * 100),
      unit: "175 ml",
      stock: 80,
      status: "active"
    },
    {
      name: "Mediker Anti Lice Treatment Shampoo",
      slug: "mediker-anti-lice-treatment-shampoo",
      imageUrl: ["/uploads/products/mediker-anti-lice-shampoo.png"],
      price: 56,
      mrp: 60,
      description: "Anti-lice treatment shampoo for lice removal.",
      discount: Math.round(((60 - 56) / 60) * 100),
      unit: "50 ml",
      stock: 60,
      status: "active"
    }
  ],
  'Skin Care': [
    {
      name: "Himalaya Purifying Neem Face Wash",
      slug: "himalaya-purifying-neem-face-wash",
      imageUrl: ["/uploads/products/himalaya-neem-face-wash.png"],
      price: 252,
      mrp: 279,
      description: "Purifying face wash with neem — cleanses and removes impurities.",
      discount: Math.round(((279 - 252) / 279) * 100),
      unit: "150 ml",
      stock: 120,
      status: "active"
    },
    {
      name: "Cetaphil Gentle Skin Cleanser",
      slug: "cetaphil-gentle-skin-cleanser",
      imageUrl: ["/uploads/products/cetaphil-gentle-cleanser.png"],
      price: 671,
      mrp: 799,
      description: "Gentle skin cleanser — ideal for sensitive skin.",
      discount: Math.round(((799 - 671) / 799) * 100),
      unit: "236 ml",
      stock: 80,
      status: "active"
    },
    {
      name: "Dot & Key Barrier Repair + Hydrating Face Wash",
      slug: "dot-and-key-barrier-repair-hydrating-face-wash",
      imageUrl: ["/uploads/products/dot-and-key-hydrating-face-wash.png"],
      price: 215,
      mrp: 249,
      description: "Hydrating gentle face wash — helps strengthen skin barrier.",
      discount: Math.round(((249 - 215) / 249) * 100),
      unit: "100 ml",
      stock: 90,
      status: "active"
    },
    {
      name: "Everyuth Walnut Exfoliating Face Scrub",
      slug: "everyuth-walnut-exfoliating-face-scrub",
      imageUrl: ["/uploads/products/everyuth-walnut-face-scrub.png"],
      price: 194,
      mrp: 210,
      description: "Walnut exfoliating scrub — removes dead skin cells and impurities.",
      discount: Math.round(((210 - 194) / 210) * 100),
      unit: "100 g",
      stock: 100,
      status: "active"
    },
  ],

  // Pet Care
  'Dog Food': [
    {
      name: "Drools Focus Adult Chicken Premium Dry Dog Food",
      slug: "drools-focus-adult-chicken-premium-dry-dog-food",
      imageUrl: ["/uploads/products/drools-focus-adult.png"],
      price: 658,
      mrp: 699,
      description: "Protein-rich dry dog food for adult dogs with real chicken and essential nutrients.",
      discount: Math.round(((699 - 658) / 699) * 100),
      unit: "1.2 kg",
      stock: 75,
      status: "active"
    },
    {
      name: "Pedigree Adult Wet Dog Food – Chicken & Liver Chunks in Gravy",
      slug: "pedigree-adult-wet-dog-food-chicken-liver-gravy",
      imageUrl: ["/uploads/products/pedigree-wet-chicken-liver.png"],
      price: 50,
      mrp: 50,
      description: "Wet dog food with chicken and liver chunks in gravy — tasty and rich meal.",
      discount: 0,
      unit: "70 g",
      stock: 120,
      status: "active"
    },
    {
      name: "Drools Adult Wet Dog Food – Chicken Liver Chunks in Gravy",
      slug: "drools-adult-wet-dog-food-chicken-liver-gravy",
      imageUrl: ["/uploads/products/drools-wet-chicken-liver.png"],
      price: 45,
      mrp: 45,
      description: "Wet dog food with wholesome chicken liver chunks in rich gravy.",
      discount: 0,
      unit: "150 g",
      stock: 110,
      status: "active"
    },
    {
      name: "Pedigree Adult Wet Dog Food – Pack of 15",
      slug: "pedigree-adult-wet-dog-food-pack-of-15",
      imageUrl: ["/uploads/products/pedigree-wet-pack15.png"],
      price: 654,
      mrp: 750,
      description: "Value pack of Pedigree wet food — 15 packs of chicken & liver chunks gravy.",
      discount: Math.round(((750 - 654) / 750) * 100),
      unit: "15 x 70 g",
      stock: 50,
      status: "active"
    },
  ],
  'Cat Food': [
    {
      name: "Whiskas Wet Kitten Food - Chicken in Gravy (2-12 Months)",
      slug: "whiskas-wet-kitten-food-chicken-in-gravy",
      imageUrl: ["/uploads/products/whiskas-wet-kitten-chicken.png"],
      price: 50,
      mrp: 50,
      description: "Wet kitten food with chicken in gravy for growing kittens.",
      discount: 0,
      unit: "80 g",
      stock: 120,
      status: "active"
    },
    {
      name: "Whiskas Tasty Mix Wet Adult Cat Food - Tuna & Carrot in Gravy",
      slug: "whiskas-tasty-mix-wet-adult-cat-food-tuna-carrot",
      imageUrl: ["/uploads/products/whiskas-tasty-mix-tuna-carrot.png"],
      price: 50,
      mrp: 50,
      description: "Tasty tuna and carrot wet food for adult cats.",
      discount: 0,
      unit: "70 g",
      stock: 110,
      status: "active"
    },
    {
      name: "Sheba Fine Adult Wet Cat Food - Tuna, Pumpkin & Carrot",
      slug: "sheba-fine-adult-wet-cat-food-tuna-pumpkin-carrot",
      imageUrl: ["/uploads/products/sheba-wet-tuna-pumpkin-carrot.png"],
      price: 70,
      mrp: 70,
      description: "Sheba fine wet cat food with tuna, pumpkin & carrot.",
      discount: 0,
      unit: "70 g",
      stock: 90,
      status: "active"
    },
    {
      name: "Sheba Rich Adult Wet Cat Food - Fish with Sasami",
      slug: "sheba-rich-adult-wet-cat-food-fish-sasami",
      imageUrl: ["/uploads/products/sheba-rich-fish-sasami.png"],
      price: 50,
      mrp: 50,
      description: "Rich wet cat food with fish and sasami flavour.",
      discount: 0,
      unit: "35 g",
      stock: 100,
      status: "active"
    },
    {
      name: "PurePet Ocean Fish Adult Dry Cat Food",
      slug: "purepet-ocean-fish-adult-dry-cat-food",
      imageUrl: ["/uploads/products/purepet-ocean-fish-dry.png"],
      price: 175,
      mrp: 199,
      description: "Dry adult cat food with ocean fish flavour for balanced nutrition.",
      discount: Math.round(((199 - 175) / 199) * 100),
      unit: "1 kg",
      stock: 80,
      status: "active"
    },
    {
      name: "Drools Ocean Fish Dry Kitten Cat Food",
      slug: "drools-ocean-fish-dry-kitten-cat-food",
      imageUrl: ["/uploads/products/drools-ocean-fish-dry-kitten.png"],
      price: 358,
      mrp: 380,
      description: "Dry kitten food with ocean fish — nutritious and tasty. ",
      discount: Math.round(((380 - 358) / 380) * 100),
      unit: "1.2 kg",
      stock: 60,
      status: "active"
    },
  ],

  // Baby Care
  'Diapers & Wipes': [
    {
      name: "Teddyy Easy Baby Pants Diaper (M, 7-12 kg)",
      slug: "teddyy-easy-baby-pants-diaper-m-7-12kg",
      imageUrl: ["/uploads/products/teddyy-easy-m.png"],
      price: 435,
      mrp: 949,
      description: "Easy-fit baby pants diaper for comfort and dryness.",
      discount: Math.round(((949 - 435) / 949) * 100),
      unit: "74 pcs",
      stock: 90,
      status: "active"
    },
    {
      name: "Little's Fluffy Soft Pant Style Baby Diaper (XL)",
      slug: "littles-fluffy-soft-pant-style-baby-diaper-xl",
      imageUrl: ["/uploads/products/littles-fluffy-xl.png"],
      price: 239,
      mrp: 420,
      description: "Fluffy soft pant style diaper for extra comfort.",
      discount: Math.round(((420 - 239) / 420) * 100),
      unit: "24 pcs",
      stock: 120,
      status: "active"
    },
    {
      name: "Pampers Premium Care Pant Style Baby Diaper (XL)",
      slug: "pampers-premium-care-pant-style-baby-diaper-xl",
      imageUrl: ["/uploads/products/pampers-premium-xl.png"],
      price: 909,
      mrp: 1399,
      description: "Premium care diaper with superior absorbency.",
      discount: Math.round(((1399 - 909) / 1399) * 100),
      unit: "36 pcs",
      stock: 80,
      status: "active"
    },
    {
      name: "Pampers Complete Skin Comfort Pant Style Baby Diaper (XXL)",
      slug: "pampers-complete-skin-comfort-pant-style-baby-diaper-xxl",
      imageUrl: ["/uploads/products/pampers-complete-xxl.png"],
      price: 839,
      mrp: 1399,
      description: "Complete skin comfort diaper for gentle care.",
      discount: Math.round(((1399 - 839) / 1399) * 100),
      unit: "42 pcs",
      stock: 90,
      status: "active"
    },
    {
      name: "Little's Fluffy Soft Pant Style Baby Diaper (M)",
      slug: "littles-fluffy-soft-pant-style-baby-diaper-m",
      imageUrl: ["/uploads/products/littles-fluffy-m.png"],
      price: 229,
      mrp: 420,
      description: "Soft pant diaper for everyday use.",
      discount: Math.round(((420 - 229) / 420) * 100),
      unit: "32 pcs",
      stock: 110,
      status: "active"
    },
  ],
  'Baby Food': [
    {
      name: "Nestle NAN PRO Stage 1 Infant Formula",
      slug: "nestle-nan-pro-stage-1-infant-formula",
      imageUrl: ["/uploads/products/nestle-nan-pro-stage-1.png"],
      price: 755,
      mrp: 755,
      description: "Infant formula suitable for Stage 1 infants.",
      discount: 0,
      unit: "400 g",
      stock: 80,
      status: "active"
    },
    {
      name: "Nestle Lactogen Pro 1 Infant Formula",
      slug: "nestle-lactogen-pro-1-infant-formula",
      imageUrl: ["/uploads/products/nestle-lactogen-pro-1.png"],
      price: 440,
      mrp: 440,
      description: "Powder baby milk formula for early nutrition.",
      discount: 0,
      unit: "400 g",
      stock: 90,
      status: "active"
    },
    {
      name: "Nestle Lactogen Pro 2 Follow-up Formula",
      slug: "nestle-lactogen-pro-2-follow-up-formula",
      imageUrl: ["/uploads/products/nestle-lactogen-pro-2.png"],
      price: 450,
      mrp: 450,
      description: "Follow-up formula for older infants (Stage 2).",
      discount: 0,
      unit: "400 g",
      stock: 80,
      status: "active"
    },
    {
      name: "Amulspray Baby Milk Powder",
      slug: "amulspray-baby-milk-powder",
      imageUrl: ["/uploads/products/amulspray-baby-milk.png"],
      price: 253,
      mrp: 253,
      description: "Baby milk powder for daily nutrition.",
      discount: 0,
      unit: "500 g",
      stock: 100,
      status: "active"
    },
    {
      name: "Nestle Cerelac Wheat Apple Carrot Baby Cereal",
      slug: "nestle-cerelac-wheat-apple-carrot-baby-cereal",
      imageUrl: ["/uploads/products/nestle-cerelac-wheat-apple-carrot.png"],
      price: 245,
      mrp: 245,
      description: "Baby cereal with wheat, apple and carrot — no refined sugar.",
      discount: 0,
      unit: "300 g",
      stock: 90,
      status: "active"
    },
  ],

  // Home & Cleaning
  'Cleaning Supplies': [
    {
      name: "Lizol Disinfectant Surface & Floor Cleaner (Citrus)",
      slug: "lizol-disinfectant-surface-floor-cleaner-citrus",
      imageUrl: ["/uploads/products/lizol-citrus-floor-cleaner.png"],
      price: 245,
      mrp: 280,
      description: "Citrus scented disinfectant floor cleaner — tough on germs, gentle on floors.",
      discount: Math.round(((280 - 245) / 280) * 100),
      unit: "1 L",
      stock: 90,
      status: "active"
    },
    {
      name: "Mr Muscle Kitchen Cleaner Spray",
      slug: "mr-muscle-kitchen-cleaner-spray",
      imageUrl: ["/uploads/products/mr-muscle-kitchen-cleaner.png"],
      price: 96,
      mrp: 99,
      description: "Mr Muscle kitchen cleaner — effective on grease and grime.",
      discount: Math.round(((99 - 96) / 99) * 100),
      unit: "200 ml",
      stock: 100,
      status: "active"
    },
    {
      name: "Cif Cream Multi Purpose Cleaner - Lemon",
      slug: "cif-cream-multi-purpose-cleaner-lemon",
      imageUrl: ["/uploads/products/cif-cream-cleaner-lemon.png"],
      price: 218,
      mrp: 250,
      description: "Cif cream multi-purpose cleaner with lemon scent — removes tough stains.",
      discount: Math.round(((250 - 218) / 250) * 100),
      unit: "500 ml",
      stock: 80,
      status: "active"
    },
    {
      name: "Harpic Disinfectant Toilet Cleaner (Original)",
      slug: "harpic-disinfectant-toilet-cleaner-original",
      imageUrl: ["/uploads/products/harpic-toilet-cleaner-original.png"],
      price: 202,
      mrp: 245,
      description: "Harpic toilet cleaner — deep cleans and disinfects toilets.",
      discount: Math.round(((245 - 202) / 245) * 100),
      unit: "1 L",
      stock: 85,
      status: "active"
    },
    {
      name: "SaveMore Toilet Cleaner Liquid",
      slug: "savemore-toilet-cleaner-liquid",
      imageUrl: ["/uploads/products/savemore-toilet-cleaner.png"],
      price: 57,
      mrp: 70,
      description: "Liquid toilet cleaner for everyday cleaning and freshness.",
      discount: Math.round(((70 - 57) / 70) * 100),
      unit: "500 ml",
      stock: 100,
      status: "active"
    }
  ],
  'Kitchen Essentials': [
    {
      name: "Weikfield Pure Multi-Purpose Baking Soda",
      slug: "weikfield-pure-multi-purpose-baking-soda",
      imageUrl: ["/uploads/products/weikfield-baking-soda-1.png"],
      price: 35,
      mrp: 36,
      description: "Multi-purpose baking soda for baking and cooking use.",
      discount: Math.round(((36 - 35) / 36) * 100),
      unit: "100 g",
      stock: 120,
      status: "active"
    },
    {
      name: "Abbie's Classic Pancake Syrup",
      slug: "abbies-classic-pancake-syrup",
      imageUrl: ["/uploads/products/abbies-pancake-syrup.png"],
      price: 495,
      mrp: 495,
      description: "Classic pancake syrup — rich and sweet flavour.",
      discount: 0,
      unit: "710 ml",
      stock: 60,
      status: "active"
    },
    {
      name: "Weikfield Double Action Baking Powder",
      slug: "weikfield-double-action-baking-powder",
      imageUrl: ["/uploads/products/weikfield-baking-powder.png"],
      price: 36,
      mrp: 38,
      description: "Double action baking powder for fluffier cakes and breads.",
      discount: Math.round(((38 - 36) / 38) * 100),
      unit: "100 g",
      stock: 100,
      status: "active"
    },
    {
      name: "The Select Aisle Instant Dry Yeast",
      slug: "the-select-aisle-instant-dry-yeast",
      imageUrl: ["/uploads/products/select-aisle-dry-yeast.png"],
      price: 44,
      mrp: 45,
      description: "Instant dry yeast — ideal for breads, pizzas and more.",
      discount: Math.round(((45 - 44) / 45) * 100),
      unit: "25 g",
      stock: 90,
      status: "active"
    }
  ],
  'Detergent Powder': [
    {
      name: "Softspun Microfiber Mesh Wire Steel Scrubber",
      slug: "softspun-microfiber-mesh-wire-steel-scrubber",
      imageUrl: ["/uploads/products/softspun-microfiber-scrubber.png"],
      price: 112,
      mrp: 312,
      description: "Microfiber mesh and steel scrubber for effective cleaning of cookware and utensils.",
      discount: Math.round(((312 - 112) / 312) * 100),
      unit: "5 pcs",
      stock: 80,
      status: "active"
    },
    {
      name: "Scotch Brite Sponge Scrub (3 pcs)",
      slug: "scotch-brite-sponge-scrub-3pcs",
      imageUrl: ["/uploads/products/scotch-brite-sponge-scrub.png"],
      price: 74,
      mrp: 75,
      description: "Classic Scotch Brite sponge scrub — dual texture for everyday dishwashing.",
      discount: Math.round(((75 - 74) / 75) * 100),
      unit: "3 pcs",
      stock: 120,
      status: "active"
    },
    {
      name: "Scotch Brite Stainless Steel Scrubber with Scrub Pad",
      slug: "scotch-brite-stainless-steel-scrubber-with-scrub-pad",
      imageUrl: ["/uploads/products/scotch-brite-stainless-scrubber.png"],
      price: 30,
      mrp: 30,
      description: "Stainless steel scrubber with a scrub pad — ideal for heavy grease removal.",
      discount: 0,
      unit: "1 pc",
      stock: 100,
      status: "active"
    },
    {
      name: "Scotch Brite Silver Sparks Scrub Pad (Small)",
      slug: "scotch-brite-silver-sparks-scrub-pad-small",
      imageUrl: ["/uploads/products/scotch-brite-silver-sparks-small.png"],
      price: 25,
      mrp: 25,
      description: "Small Silver Sparks scrub pads — powerful and durable for tough stains.",
      discount: 0,
      unit: "3 pcs",
      stock: 90,
      status: "active"
    }
  ],
  'Kitchen Essentials': [
    {
      name: "Puramio Panko Bread Crumbs",
      slug: "puramio-panko-bread-crumbs",
      imageUrl: ["/uploads/products/puramio-panko-bread-crumbs.png"],
      price: 288,
      mrp: 360,
      description: "Panko style bread crumbs — perfect for coating and crisping.",
      discount: Math.round(((360 - 288) / 360) * 100),
      unit: "400 g",
      stock: 80,
      status: "active"
    },
    {
      name: "Weikfield Pure Multi-Purpose Baking Soda",
      slug: "weikfield-pure-multi-purpose-baking-soda",
      imageUrl: ["/uploads/products/weikfield-baking-soda.png"],
      price: 35,
      mrp: 36,
      description: "Multi-purpose baking soda — ideal for baking and cooking.",
      discount: Math.round(((36 - 35) / 36) * 100),
      unit: "100 g",
      stock: 120,
      status: "active"
    },
    {
      name: "Abbie's Classic Pancake Syrup",
      slug: "abbies-classic-pancake-syrup",
      imageUrl: ["/uploads/products/abbies-pancake-syrup.png"],
      price: 495,
      mrp: 495,
      description: "Classic pancake syrup — sweet and rich flavour.",
      discount: 0,
      unit: "710 ml",
      stock: 60,
      status: "active"
    },
    {
      name: "Puramate Culinary Vanilla Essence",
      slug: "puramate-culinary-vanilla-essence",
      imageUrl: ["/uploads/products/puramate-vanilla-essence.png"],
      price: 40,
      mrp: 40,
      description: "Vanilla essence for baking and desserts.",
      discount: 0,
      unit: "30 ml",
      stock: 90,
      status: "active"
    },
    {
      name: "Weikfield Double Action Baking Powder",
      slug: "weikfield-double-action-baking-powder",
      imageUrl: ["/uploads/products/weikfield-baking-powder.png"],
      price: 36,
      mrp: 38,
      description: "Double action baking powder — helps your baked goods rise perfectly.",
      discount: Math.round(((38 - 36) / 38) * 100),
      unit: "100 g",
      stock: 100,
      status: "active"
    }
  ],
  // Meat, Fish & Eggs
  'Fresh Meat': [
    {
      name: "Licious Chicken Curry Cut (Large Pieces)",
      slug: "licious-chicken-curry-cut-large-pieces",
      imageUrl: ["/uploads/products/licious-chicken-curry-cut-large.png"],
      price: 185,
      mrp: 205,
      description: "Licious fresh chicken curry cut – ideal for curries and stews.",
      discount: Math.round(((205 - 185) / 205) * 100),
      unit: "450 g",
      stock: 60,
      status: "active"
    },
    {
      name: "Licious Chicken Breast - Boneless",
      slug: "licious-chicken-breast-boneless",
      imageUrl: ["/uploads/products/licious-chicken-breast.png"],
      price: 299,
      mrp: 325,
      description: "Premium boneless chicken breast — lean and protein-rich.",
      discount: Math.round(((325 - 299) / 325) * 100),
      unit: "400 g",
      stock: 50,
      status: "active"
    },
    {
      name: "ChefiGo Chicken Curry Cut",
      slug: "chefigo-chicken-curry-cut",
      imageUrl: ["/uploads/products/chefigo-chicken-curry-cut.png"],
      price: 143,
      mrp: 210,
      description: "ChefiGo fresh chicken curry cut — great for traditional dishes.",
      discount: Math.round(((210 - 143) / 210) * 100),
      unit: "450 g",
      stock: 70,
      status: "active"
    },
    {
      name: "ChefiGo Boneless Chicken Breast",
      slug: "chefigo-boneless-chicken-breast",
      imageUrl: ["/uploads/products/chefigo-boneless-breast.png"],
      price: 240,
      mrp: 280,
      description: "Boneless chicken breast from ChefiGo — ideal for grilling and sautéing.",
      discount: Math.round(((280 - 240) / 280) * 100),
      unit: "450 g",
      stock: 60,
      status: "active"
    }
  ],
  'Seafood': [
    {
      name: "ITC Master Chef Medium Prawns Peeled & Deveined (Frozen)",
      slug: "itc-master-chef-medium-prawns-peeled-deveined-frozen",
      imageUrl: ["/uploads/products/itc-master-chef-medium-prawns.png"],
      price: 220,
      mrp: 250,
      description: "Frozen medium prawns, peeled and deveined for easy cooking.",
      discount: Math.round(((250 - 220) / 250) * 100),
      unit: "200 g",
      stock: 60,
      status: "active"
    },
    {
      name: "ITC Master Chef Large Prawns Peeled & Deveined (Frozen)",
      slug: "itc-master-chef-large-prawns-peeled-deveined-frozen",
      imageUrl: ["/uploads/products/itc-master-chef-large-prawns.png"],
      price: 251,
      mrp: 285,
      description: "Large prawns, peeled and deveined — great for curries and grilling.",
      discount: Math.round(((285 - 251) / 285) * 100),
      unit: "200 g",
      stock: 50,
      status: "active"
    },
    {
      name: "Godrej Real Good Large Prawns Peeled & Deveined",
      slug: "godrej-real-good-large-prawns-peeled-deveined",
      imageUrl: ["/uploads/products/godrej-large-prawns.png"],
      price: 240,
      mrp: 280,
      description: "Large prawns from Godrej — ready for cooking or frying.",
      discount: Math.round(((280 - 240) / 280) * 100),
      unit: "200 g",
      stock: 50,
      status: "active"
    },
    {
      name: "Godrej Real Good Medium Prawns Peeled & Deveined",
      slug: "godrej-real-good-medium-prawns-peeled-deveined",
      imageUrl: ["/uploads/products/godrej-medium-prawns.png"],
      price: 210,
      mrp: 265,
      description: "Medium prawns, peeled and deveined — versatile for many recipes.",
      discount: Math.round(((265 - 210) / 265) * 100),
      unit: "200 g",
      stock: 70,
      status: "active"
    },
    {
      name: "Golden Prize Pink Salmon in Oil",
      slug: "golden-prize-pink-salmon-in-oil",
      imageUrl: ["/uploads/products/golden-prize-pink-salmon.png"],
      price: 650,
      mrp: 699,
      description: "Pink salmon packed in oil — great for salads and sandwiches.",
      discount: Math.round(((699 - 650) / 699) * 100),
      unit: "2 x 120 g",
      stock: 40,
      status: "active"
    }
  ],
  'Eggs': [
    {
      name: "Eggoz Nutrition White Protein Rich Eggs (30 pcs)",
      slug: "eggoz-nutrition-white-protein-rich-eggs-30pcs",
      imageUrl: ["/uploads/products/eggoz-30pcs.png"],
      price: 335,
      mrp: 409,
      description: "Eggoz Nutrition white protein rich eggs — pack of 30, great for regular use.",
      discount: Math.round(((409 - 335) / 409) * 100),
      unit: "30 pcs",
      stock: 50,
      status: "active"
    },
    {
      name: "Eggoz Nutrition White Protein Rich Eggs (10 pcs)",
      slug: "eggoz-nutrition-white-protein-rich-eggs-10pcs",
      imageUrl: ["/uploads/products/eggoz-10pcs.png"],
      price: 130,
      mrp: 145,
      description: "Eggoz Nutrition white protein rich eggs — pack of 10.",
      discount: Math.round(((145 - 130) / 145) * 100),
      unit: "10 pcs",
      stock: 80,
      status: "active"
    },
    {
      name: "Eggoz Nutrition White Protein Rich Eggs (6 pcs)",
      slug: "eggoz-nutrition-white-protein-rich-eggs-6pcs",
      imageUrl: ["/uploads/products/eggoz-6pcs.png"],
      price: 75,
      mrp: 90,
      description: "Eggoz nutrition white protein rich eggs — pack of 6.",
      discount: Math.round(((90 - 75) / 90) * 100),
      unit: "6 pcs",
      stock: 100,
      status: "active"
    },
    {
      name: "Licious Farm Fresh Classic White Protein Rich Eggs (6 pcs)",
      slug: "licious-farm-fresh-classic-white-protein-rich-eggs-6pcs",
      imageUrl: ["/uploads/products/licious-farm-6pcs.png"],
      price: 81,
      mrp: 90,
      description: "Licious farm fresh classic white protein rich eggs — 6 count.",
      discount: Math.round(((90 - 81) / 90) * 100),
      unit: "6 pcs",
      stock: 70,
      status: "active"
    }
  ]
};

// ---------------- Utility Functions ----------------

const getRandomPrice = () =>
  parseFloat((Math.random() * 10 + 5).toFixed(2));
const getRandomDiscount = () => Math.floor(Math.random() * 25);
const getRandomStock = () =>
  Math.floor(Math.random() * 100) + 10;

// ---------------- Seeder ----------------
const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const categoryDocs = {};
    const subCategoryDocs = {};

    /* ==========================
       1️⃣ MAIN CATEGORIES
    ========================== */
    for (const cat of categories) {
      const doc = await ProductCategory.findOneAndUpdate(
        { slug: cat.slug }, // unique field
        {
          name: cat.name,
          imageUrl: cat.imageUrl,
          description: cat.description,
          parentCategory: null,
        },
        { upsert: true, new: true }
      );

      categoryDocs[cat.name] = doc;
    }

    console.log("📁 Main categories seeded/updated");

    /* ==========================
       2️⃣ SUBCATEGORIES
    ========================== */
    for (const [parentName, subs] of Object.entries(subcategories)) {
      const parent = categoryDocs[parentName];

      if (!parent) {
        console.log(`⚠️ Parent not found: ${parentName}`);
        continue;
      }

      for (const sub of subs) {
        const doc = await ProductCategory.findOneAndUpdate(
          { slug: sub.slug },
          {
            name: sub.name,
            imageUrl: sub.imageUrl,
            description: sub.description,
            parentCategory: parent._id,
          },
          { upsert: true, new: true }
        );

        subCategoryDocs[sub.name] = doc;
      }
    }

    console.log("📂 Subcategories seeded/updated");

    /* ==========================
       3️⃣ PRODUCTS
    ========================== */
    for (const [subName, productList] of Object.entries(
      productsBySubcategory
    )) {
      const subCat = subCategoryDocs[subName];

      if (!subCat) {
        console.log(`⚠️ Subcategory not found: ${subName}`);
        continue;
      }

      for (const prod of productList) {
        await Product.findOneAndUpdate(
          {
            name: prod.name,
            category_id: subCat._id,
          },
          {
            name: prod.name,
            imageUrl: prod.imageUrl,
            price: prod.price,
            mrp: prod.mrp,
            discount: prod.discount,
            stock: prod.stock,
            category_id: subCat._id,
            status: "active",
            description: prod.description,
            unit: prod.unit,
            slug: prod.slug
          },
          { upsert: true, new: true }
        );
      }
    }

    console.log("🛒 Products seeded/updated");

    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    await mongoose.disconnect();
  }
};

seedData();