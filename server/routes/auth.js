const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
// const SHA256 = require("crypto-js/sha256");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

function encrypt(text, secret) {
  let ciphertext = CryptoJS.AES.encrypt(text, secret).toString();
  return ciphertext;
}

function decrypt(ciphertext, secret) {
  let bytes = CryptoJS.AES.decrypt(ciphertext, secret);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

router.post("/signup", (req, res) => {
  // console.log(req.body);
  const {
    aadharNo,
    email,
    phone,
    gender,
    age,
    city,
    password,
    confirmpass,
  } = req.body;

  const txt = aadharNo + password;
  // console.log(uid);
  const uid = CryptoJS.SHA256(txt).toString();
  //console.log(hash);

  User.findOne({ uId: uid })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists" });
      }
      const encryptedPhone = encrypt(phone.toString(), password);
      const encryptedGender = encrypt(gender, SECRET_KEY);
      const encryptedAge = encrypt(age.toString(), SECRET_KEY);
      const encryptedCity = encrypt(city, SECRET_KEY);
      const encryptedEmail = encrypt(email, SECRET_KEY);

      const user = new User({
        uId: uid,
        email: encryptedEmail,
        phoneNo: encryptedPhone,
        gender: encryptedGender,
        age: encryptedAge,
        city: encryptedCity,
      });

      user
        .save()
        .then((user) => {
          res.json({ message: "Signed In Successfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { aadharNo, password } = req.body;

  const txt = aadharNo + password;
  // console.log(txt);
  const uid = CryptoJS.SHA256(txt).toString();
  //console.log(uid);

  User.findOne({ uId: uid }).then((savedUser) => {
    if (!savedUser) {
      return res
        .status(422)
        .json({ error: "Invalid *Aadhar No* or *Password*" });
    }

    const decryptedPhoneNo = decrypt(savedUser.phoneNo, password);
    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
    const { _id, uId,  gender, age, city } = savedUser;

    res.json({
      mobileNo: decryptedPhoneNo,
      user: { _id, uId, gender, age, city },
      token,
    });
    // res.json({ message: "signed in successfully" });
    //console.log(savedUser);
  });
});

module.exports = router;
