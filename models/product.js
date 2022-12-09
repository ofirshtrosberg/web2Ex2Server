const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true,
        min: 0
    },
    date: {
        type: Date,
        require:true,
    }
})

const Product = mongoose.model('products', productSchema);
module.exports = Product;
