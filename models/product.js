const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        require: true,
    },
    text: {
        type: String,
        require: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true })

const productSchema = new mongoose.Schema ({
    title: {
        type: String,
        require: true,
    },
    subtitle: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
        enum: ['Live Plant', 'Cutting', 'Seedling','Seed', 'Accessories', 'Others']
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    stock: {
        type: Number,
        require: true,
    },
    productImage: {
        type: String,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [reviewSchema],
    
}, { timestamps: true })



const Product = mongoose.model('Product', productSchema)

module.exports = Product