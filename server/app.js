const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");
const PORT = 5000;
//J3K42TjHpynWRLnz

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

require("./models/user");

app.use(express.json());
app.use(require("./routes/auth"));

mongoose.connection.on("connected", () => {
  console.log("connnected to mongo db");
});

mongoose.connection.on("error", (err) => {
  console.log("error connecting", err);
});

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
