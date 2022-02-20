const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  btnFlag: {
    type: Boolean,
    required: true,
    default: false,
  },
  chartFlag: {
    type: Boolean,
    required: true,
    default: false,
  },
});

mongoose.model("Admin", adminSchema);
