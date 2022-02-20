const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
// const SHA256 = require("crypto-js/sha256");
const User = mongoose.model("User");
const Admin = mongoose.model("Admin");
const jwt = require("jsonwebtoken");
const {
  SECRET_KEY,
  JWT_SECRET,
  EMAIL,
  EMAIL_PASS,
  HOST,
} = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");

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

  const hashedAadhar = CryptoJS.SHA256(aadharNo).toString();

  const txt = hashedAadhar + password;
  // console.log(uid);
  const uid = CryptoJS.SHA256(txt).toString();
  //console.log(hash);

  //console.log(encryptedAadhar);
  User.findOne({ aadhar: hashedAadhar })
    .then((savedUser) => {
      //console.log(savedUser);
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with this Aadhar No." });
      }
      // if (savedUser.aadhar == aadharNo) {
      //   return res
      //     .status(422)
      //     .json({ error: "User already exists with that Aadhar No." });
      // }
      // if (savedUser.email == email) {
      //   return res
      //     .status(422)
      //     .json({ error: "User already exists with that email" });
      // }
      const encryptedPhone = encrypt(phone.toString(), password);
      const encryptedGender = encrypt(gender, SECRET_KEY);
      const encryptedAge = encrypt(age.toString(), SECRET_KEY);
      const encryptedCity = encrypt(city, SECRET_KEY);
      const encryptedEmail = encrypt(email, SECRET_KEY);
      const encryptedAadhar = encrypt(hashedAadhar, SECRET_KEY);

      const user = new User({
        uId: uid,
        email: encryptedEmail,
        phoneNo: encryptedPhone,
        gender: encryptedGender,
        age: encryptedAge,
        city: encryptedCity,
        aadhar: encryptedAadhar,
      });

      user
        .save()
        .then((user) => {
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: EMAIL,
              pass: EMAIL_PASS,
            },
          });
          transporter.sendMail(
            {
              from: EMAIL,
              to: email, // list of receivers
              subject: "VOTECHAIN [Registered Successfully]", // Subject line
              html:
                "<h3>You have successfully registered on VoteChain</h3>" +
                "<br><h3>Save this Unique_ID (uId)</h3>" +
                '<b>"' +
                user.uId +
                '"</b>' +
                "<br><p> If in case you forgot your password use this (uId) for resetting the password.</p>",
            },
            (error, response) => {
              if (error) {
                console.log(error);
              } else {
                // console.log(response);
              }
            }
          );
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
  //console.log(aadharNo);
  const hashedAadhar = CryptoJS.SHA256(aadharNo).toString();
  const txt = hashedAadhar + password;
  // console.log(txt);
  const uid = CryptoJS.SHA256(txt).toString();
  //console.log(uid);
  User.findOne({ uId: uid }).then((savedUser) => {
    if (!savedUser) {
      return res
        .status(422)
        .json({ error: "Invalid *Aadhar No* or *Password*" });
    }
    const voted = false;
    const decryptedPhoneNo = decrypt(savedUser.phoneNo, password);
    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
    const { _id, uId, gender, age, city, phoneNo, email, isAdmin } = savedUser;

    res.json({
      mobileNo: decryptedPhoneNo,
      user: { _id, uId, gender, age, city, phoneNo, email, voted, isAdmin },
      token,
    });
    // res.json({ message: "signed in successfully" });
    //console.log(savedUser);
  });
});

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const { uId } = req.body;
    const token = buffer.toString("hex");
    User.findOne({ uId: uId }).then((user) => {
      if (!user) {
        return res.status(422).json({ err: "*Unique Id* does not match!" });
      }

      const decryptedEmail = decrypt(user.email, SECRET_KEY);
      const link = HOST + "/reset-password/" + token;
      // console.log(token);
      // console.log(typeof token);
      //console.log(decrypt(user.aadhar, SECRET_KEY));
      user.resetToken = token;
      user.expireToken = Date.now() + 300000;
      // user.save().then((result) => {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: EMAIL,
          pass: EMAIL_PASS,
        },
      });
      transporter.sendMail(
        {
          from: EMAIL,
          to: decryptedEmail, // list of receivers
          subject: "VOTECHAIN [Password Reset]", // Subject line
          html:
            "<h3>You have requested to reset your password</h3>" +
            "<br><h3>Click on this link to reset <a href='" +
            link +
            "'>password!</a></h3>" +
            "<br><p>This link is valid only for 5 minutes!!</p>",
        },
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            //console.log(res);
          }
        }
      );
      user.save();
      res.json({
        message: "Check your Email",
      });
      //});
    });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ err: "Try again session expired" });
      }
      const hashedAadhar = decrypt(user.aadhar, SECRET_KEY);
      //console.log(decryptedAadhar);
      const txt = hashedAadhar + newPassword;
      // console.log(uid);
      const uid = CryptoJS.SHA256(txt).toString();

      const decryptedEmail = decrypt(user.email, SECRET_KEY);
      //console.log(req.body.phone);
      const encryptedPhone = encrypt(req.body.phone.toString(), newPassword);
      //console.log(encryptedPhone);
      user.uId = uid;
      user.resetToken = undefined;
      user.expireToken = undefined;
      user.phoneNo = encryptedPhone;
      user
        .save()
        .then((savedUser) => {
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: EMAIL,
              pass: EMAIL_PASS,
            },
          });
          transporter.sendMail(
            {
              from: EMAIL,
              to: decryptedEmail, // list of receivers
              subject: "VOTECHAIN [Credentials Changed Successfully]", // Subject line
              html:
                "<h3>You have successfully changed your password on VoteChain</h3>" +
                "<br><h3>Save this Unique_ID (uId)</h3>" +
                '<b>"' +
                savedUser.uId +
                '"</b>' +
                "<br><p> If in case you forgot your password use this (uId) for resetting the password.</p>",
            },
            (error, response) => {
              if (error) {
                console.log(error);
              } else {
                //console.log(response);
              }
            }
          );
          //console.log(savedUser);
          res.json({ message: "password updated success" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/verify-password", requireLogin, (req, res) => {
  const password = req.body.value;
  const phoneNo = req.body.phoneNo;

  const decryptedPhoneNo = decrypt(phoneNo, password);
  //console.log(decryptedPhoneNo);
  if (!decryptedPhoneNo) {
    return res.status(422).json({ error: "Incorrect Password" });
  } else {
    res.json({ phone: decryptedPhoneNo });
  }
});

router.post("/send-mail", requireLogin, (req, res) => {
  const decryptedEmail = decrypt(req.body.email, SECRET_KEY);
  //console.log(decryptedEmail);
  //console.log(req.body.uid);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL,
      pass: EMAIL_PASS,
    },
  });
  var today = new Date();
  var date =
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  transporter.sendMail(
    {
      from: EMAIL,
      to: decryptedEmail, // list of receivers
      subject: "VOTECHAIN [Voted Successfully]", // Subject line
      html:
        '<br><h3>You have  successfully voted "' +
        req.body.candidateName +
        '" on VoteChain with Unique_ID (uId) :</h3><b>"' +
        req.body.uid +
        "</b>" +
        " on " +
        dateTime,
    },
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        //console.log(response);
      }
    }
  );
});

router.post("/set-flag", requireLogin, (req, res) => {
  const { flag, chartFlag } = req.body;
  Admin.findOne({ btnFlag: !flag }).then((admin) => {
    admin.btnFlag = flag;
    admin.chartFlag = chartFlag;
    admin
      .save()
      .then((savedAdmin) => {
        res.json({ message: savedAdmin.btnFlag });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/flag", requireLogin, (req, res) => {
  Admin.findOne().then((admin) => {
    res.json({ message: admin.btnFlag });
  });
});

router.get("/chart-flag", requireLogin, (req, res) => {
  Admin.findOne().then((admin) => {
    // console.log(admin);
    res.json({ message: admin.chartFlag });
  });
});

router.get("/send-mail-all", requireLogin, (req, res) => {
  User.find({})
    .then((user) => {
      for (let i = 0; i < user.length; i++) {
        const decryptedEmail = decrypt(user[i].email, SECRET_KEY);
        // console.log(decryptedEmail);
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: EMAIL,
            pass: EMAIL_PASS,
          },
        });
        var today = new Date();
        var date =
          today.getDate() +
          "/" +
          (today.getMonth() + 1) +
          "/" +
          today.getFullYear();
        var time =
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        var dateTime = date + " " + time;
        transporter.sendMail(
          {
            from: EMAIL,
            to: decryptedEmail, // list of receivers
            subject: "VOTECHAIN [Result are Out]", // Subject line
            html: `<br><h3> The Voting is ended. <br> The result are Out Kindly go to Dashboard page to checkout the result.</h3>  <br> <p>${
              HOST + "/dashboard"
            }<p> <br> ${dateTime}`,
          },
          (error, response) => {
            if (error) {
              console.log(error);
            } else {
              //console.log(response);
            }
          }
        );
      }
      res.json({ message: "Sent Mail Successfully" });
    })
    .catch((err) => console.error(`Failed to find documents: ${err}`));
});

module.exports = router;
