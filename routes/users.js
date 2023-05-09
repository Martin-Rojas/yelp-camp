const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require(`passport`);
const { checkReturnTo } = require("../middleware");
const users = require(`../controllers/users`);
const user = require("../models/user");

router
   .route(`/register`)
   // render the register form
   .get(users.renderRegisterForm)
   // The register form is handle by this route. It register a user.
   .post(catchAsync(users.registerUser));

router
   .route(`/login`)
   // This route will render the login form.
   .get(users.renderLoginRender)
   // This will hanlde the login submittion
   // "passport.authenticate" it will compare the hashpassword and the password the user entered.
   .post(
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
