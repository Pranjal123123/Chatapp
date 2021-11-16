const express = require("express");
const router = express.Router();
// const User = require("../src/models/User");
const authorization = require("../src/middleware/auth");
const jwt = require("jsonwebtoken");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
router.get("/message", (req, res) => {
    res.render("message");
  });
module.exports = router;