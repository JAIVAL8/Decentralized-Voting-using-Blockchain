const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //authorization === Bearer wifjgvnewi948uvdnasc9290
  if (!authorization) {
    return res.status(401).json({ err: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", ""); //replacing bearer with empty to access only token
  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({ err: "you must be logged in" });
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
