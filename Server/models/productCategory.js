const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    slug: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    status: { type: String, default: 'active' },
    parentCategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ProductCategory', 
        default: null 
    }
}, {
    timestamps: true   // 👈 This adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);