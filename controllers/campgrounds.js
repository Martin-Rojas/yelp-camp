const Campground = require("../models/campGround");

module.exports.index = async (req, res) => {
   const campgrounds = await Campground.find({});
   res.render("campgrounds", { campgrounds });
};

module.exports.newCampgroundForm = (req, res) => {
   res.render("new");
};

module.exports.createCampground = async (req, res, next) => {
   const newCampground = new Campground(req.body.campground);
   // It will add the current user as the author of the campground.
   newCampground.author = req.user._id;
   await newCampground.save();
   // Set a flash message by passing the key, followed by the value, to req.flash().
   req.flash("success", "Successfully create a campground!");
   res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.editCampground = async (req, res) => {
   const { id } = req.params;

   const campGroundFound = await Campground.findById(id);

   /** This line will prevent an error for not found the campground */
   if (!campGroundFound) {
      // Set a flash message by passing the key, followed by the value, to req.flash().
      req.flash("error", "Campground Not Found");
      return res.redirect("/campgrounds");
   }

   res.render("edit", { campGroundFound });
};

module.exports.updateCampground = async (req, res) => {
   const campGroundEdited = await Campground.findByIdAndUpdate(req.params.id, {
      // copies all properties
      ...req.body.campground,
   });

   req.flash("success", "Successfully updated campground");
   res.redirect(`/campgrounds/${campGroundEdited._id}`);
};

module.exports.showCampground = async (req, res, next) => {
   const { id } = req.params;
   const campGroundFound = await Campground.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");

   /** This line will prevent an error for not found the campground */
   if (!campGroundFound) {
      // Set a flash message by passing the key, followed by the value, to req.flash().
      req.flash("error", "Campground Not Found");
      return res.redirect("/campgrounds");
   }

   res.render("show", { campGroundFound });
};

module.exports.deleteCampground = async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndDelete(id);
   // Set a flash message by passing the key, followed by the value, to req.flash().
   req.flash("success", "Successfully delete a campground!");
   res.redirect("/campgrounds");
};
