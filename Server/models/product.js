const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ProductCategory', 
        required: true 
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: [
        {
            type: String,
            required: true
        }
    ],
    price: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    maxCount: {
        type: Number,
        required: false,
        default: 5
    },
    unit:{
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'out-of-stock'],
        default: 'active'
    }
}, {
    timestamps: true   // 👈 This adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Product', productSchema);
