module.exports.isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      // Thid will add a property to the session obj
      // and check if is a specific route to return to.
      req.session.returnTo = req.originalUrl;

      req.flash(`error`, `You must be sign in first.`);
      return res.redirect("/login");
   }
   next();
};

module.exports.checkReturnTo = (req, res, next) => {
   console.log(req.session.returnTo);
   if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
   }
   next();
};
