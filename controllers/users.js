const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
   res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
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
};

module.exports.renderLoginRender = (req, res) => {
   res.render("users/login");
};

module.exports.authenticateUser = (req, res) => {
   req.flash("success", "Welcome back.");
   const redirectUrl = res.locals.returnTo || "/campgrounds";
   res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
   req.logout(function (err) {
      if (err) {
         return next(err);
      }
      req.flash("success", "successfully logout");
      res.redirect("/campgrounds");
   });
};
