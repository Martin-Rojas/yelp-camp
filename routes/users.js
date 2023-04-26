const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require(`passport`);
const { checkReturnTo } = require("../middleware");

// render the register form
router.get("/register", (req, res) => {
   res.render("users/register");
});

// The register form is handle by this route. It register a user.
router.post(
   "/register",
   catchAsync(async (req, res, next) => {
      try {
         const { username, password, email } = req.body;
         const user = new User({ username, email });
         const registeredUser = await User.register(user, password);

         // It will prevent the user to login after they register.
         req.login(registeredUser, function (err) {
            if (err) {
               return next(err);
            }
            req.flash("success", `Welcome to campgrounds`);
            res.redirect("/campgrounds");
         });
      } catch (e) {
         req.flash(`error`, e.message);
         res.redirect("/register");
      }
   })
);

// This route will render the login form.
router.get("/login", (req, res) => {
   res.render("users/login");
});

// This will hanlde the login submition
// "passport.authenticate" it will compare the hashpassword and the password the user entered.
router.post(
   "/login",
   checkReturnTo,
   passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
   }),
   (req, res) => {
      req.flash("success", "Welcome back.");
      const redirectUrl = res.locals.returnTo || "/campgrounds";
      res.redirect(redirectUrl);
   }
);

// Route to logout a user
router.get("/logout", (req, res, next) => {
   req.logout(function (err) {
      if (err) {
         return next(err);
      }
      req.flash("success", "successfully logout");
      res.redirect("/campgrounds");
   });
});

module.exports = router;
