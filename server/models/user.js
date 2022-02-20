const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  aadhar: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

mongoose.model("User", userSchema);
