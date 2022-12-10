const mongoose = require('mongoose');
const product = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
    min: 0,
  },
  imgsrc1: {
    type: String,
    require: true,
  },
  imgsrc2: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  store: {
    type: String,
    require: true,
  },
});

const Product = mongoose.model('product', product);
module.exports = Product;
