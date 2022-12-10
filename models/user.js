const mongoose = require("mongoose");
const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: [String],
    required: true,
    default: ["user"],
  },
});

const User = mongoose.model("User", user);
module.exports = User;
