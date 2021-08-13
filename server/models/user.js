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
  age: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

mongoose.model("User", userSchema);
