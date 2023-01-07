const mongoose = require("mongoose");
const order = new mongoose.Schema({
  client_name: {
    type: String,
    required: true,
  },
  credit_card_number: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default:[],
  },
});

const Order = mongoose.model("Order", order);
module.exports = Order;
