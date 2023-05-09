const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require(`passport`);
const { checkReturnTo } = require("../middleware");
const users = require(`../controllers/users`);
const user = require("../models/user");

// render the register form
router.get("/register", users.renderRegisterForm);

// The register form is handle by this route. It register a user.
router.post("/register", catchAsync(users.registerUser));

// This route will render the login form.
router.get("/login", users.renderLoginRender);

// This will hanlde the login submittion
// "passport.authenticate" it will compare the hashpassword and the password the user entered.
router.post(
   "/login",
   checkReturnTo,
   passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
   }),
   users.authenticateUser
);

// Route to logout a user
router.get("/logout", users.logout);

module.exports = router;
