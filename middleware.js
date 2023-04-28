const Campground = require("./models/campGround");
const ExpressError = require("./utils/expressErrors");
const { campgroundSchema, reviewSchema } = require("./schemas/schemas");

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

// This middleware only will be use for a specific routes.
// that checks for errors before a campground is made.
module.exports.validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);

   if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
};

module.exports.isAuthor = async (req, res, next) => {
   const { id } = req.params;
   const campground = await Campground.findById(id);

   if (!req.user) {
      req.flash(`error`, `You do not have permission to do that.`);
      return res.redirect(`/campgrounds/${id}`);
   }
   if (!campground.author.equals(req.user._id)) {
      req.flash(`error`, `You do not have permission to do that.`);
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
};
