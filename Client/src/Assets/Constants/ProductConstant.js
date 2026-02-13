// import fruitImg from "../Components/Images/fruits.jpg";
import fruitImg from "../Images/fruits.jpg";
import beveragesImg from "../Images/beveragesImg.jpg";
import eggImg from "../Images/eggImg.jpg";
import breadImg from "../Images/breadsImg.jpg";
import meatImg from "../Images/meatImg.jpg";
import natureImg from "../Images/natureImg.jpg";
import product1 from "../Images/product1.png";
import product2 from "../Images/product2.png";

const categories = [
  { id: 1, title: "Fruits & Veges", img: fruitImg },
  { id: 2, title: "Bread & Sweets", img: breadImg },
  { id: 3, title: "Beverages", img: beveragesImg },
  { id: 4, title: "Meat Products", img: meatImg },
  { id: 5, title: "Breads", img: breadImg },
  { id: 6, title: "Fruits & Veges", img: eggImg },
  { id: 7, title: "Breads", img: beveragesImg },
  { id: 8, title: "Breads", img: natureImg },
];

const bestSellingProducts = [
  { id: 1, title: "Whole Wheat Sandwich Bread", img: product1, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
  { id: 2, title: "Whole Grain Oatmeal", img: product2, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
  { id: 3, title: "Sharp Cheddar Cheese Block", img: beveragesImg, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
  { id: 4, title: "Organic Baby Spinach", img: meatImg, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
  { id: 5, title: "Organic Spinach Leaves (Fresh Produce)", img: breadImg, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
  { id: 6, title: "Fresh Salmon", img: eggImg, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
  { id: 7, title: "Imported Italian Spaghetti Pasta", img: beveragesImg, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
  { id: 8, title: "Granny Smith Apples", img: natureImg, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
  { id: 9, title: "Organic 2% Reduced Fat Milk", img: natureImg, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
  { id: 10, title: "Greek Style Plain Yogurt", img: natureImg, totalPrice: "24.00", currentPrice: "18.00", off: 10 },
];

export const Products = {categories:categories, bestSellingProducts:bestSellingProducts
} 
