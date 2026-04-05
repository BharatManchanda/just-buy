const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/user');

dotenv.config();

const MONGO_URI = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/justbuy';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@justbuy.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_PHONE = process.env.ADMIN_PHONE ? Number(process.env.ADMIN_PHONE) : undefined;
const ADMIN_ROLE = process.env.ADMIN_ROLE || 'admin';
const ADMIN_IS_ROOT = process.env.ADMIN_IS_ROOT
  ? process.env.ADMIN_IS_ROOT === 'true'
  : true;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    let admin = await User.findOne({ email: ADMIN_EMAIL });

    if (!admin) {
      admin = new User({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        userRole: ADMIN_ROLE,
        isRootAdmin: ADMIN_IS_ROOT
      });
      if (ADMIN_PHONE) admin.phoneNumber = ADMIN_PHONE;
      await admin.save();
      console.log(`Admin created: ${ADMIN_EMAIL}`);
    } else {
      admin.password = ADMIN_PASSWORD;
      admin.userRole = ADMIN_ROLE;
      admin.isRootAdmin = ADMIN_IS_ROOT;
      if (ADMIN_PHONE) admin.phoneNumber = ADMIN_PHONE;
      await admin.save();
      console.log(`Admin updated: ${ADMIN_EMAIL}`);
    }

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Admin seeder failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
