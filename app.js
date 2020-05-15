//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const md5 = require("md5")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


// set up mongoose
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

const User = mongoose.model("User", userSchema)


app.get("/", function(req, res) {
  res.render("home")
})

app.get("/login", function(req, res) {
  res.render("login")
})

app.get("/register", function(req, res) {
  res.render("register")
})

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  })
  newUser.save(function(err) {
    if (!err) {
      res.render('secrets')
    } else {
      console.log(err);
    }
  })
})

app.post("/login", function(req, res) {
  const email = req.body.username;
  const password = md5(req.body.password);
  console.log("received password is "+password);
  User.findOne({
    email: email
  }, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        }
      }
    } else {
      console.log(err);
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
})
