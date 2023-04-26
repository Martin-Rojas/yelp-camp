const express = require("express");
const router = express.Router();
const { campgroundSchema, reviewSchema } = require("../schemas/schemas");
const Campground = require("../models/campGround");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressErrors");
const { isLoggedIn } = require("../middleware");

// This middleware only will be use for a specific routes.
// that checks for errors before a campground is made.
const validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);

   if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
};

// Show all campgrounds
router.get(
   "/",
   catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({});
      res.render("campgrounds", { campgrounds });
   })
);

// show form to create a new campground
router.get("/new", isLoggedIn, (req, res) => {
   res.render("new");
});

// Create a new campground
router.post(
   "/",
   validateCampground,
   catchAsync(async (req, res, next) => {
      const newCampground = new Campground(req.body.campground);
      await newCampground.save();
      // Set a flash message by passing the key, followed by the value, to req.flash().
      req.flash("success", "Successfully create a campground!");
      res.redirect(`/campgrounds/${newCampground._id}`);
   })
);

// Edit campground
router.get(
   "/:id/edit",
   catchAsync(async (req, res) => {
      const { id } = req.params;

      const campGroundFound = await Campground.findById(id);

      /** This line will prevent an error for not found the campground */
      if (!campGroundFound) {
         // Set a flash message by passing the key, followed by the value, to req.flash().
         req.flash("error", "Campground Not Found");
         return res.redirect("/campgrounds");
      }

      res.render("edit", { campGroundFound });
   })
);

// Update a campground
router.put(
   "/:id",
   catchAsync(async (req, res, next) => {
      const campGroundEdited = await Campground.findByIdAndUpdate(
         req.params.id,
         {
            // copies all properties
            ...req.body.campground,
         }
      );

      req.flash("success", "Successfully updated campground");
      res.redirect("/campgrounds");
   })
);

// Show a campground
router.get(
   "/:id",
   catchAsync(async (req, res, next) => {
      const { id } = req.params;
      const campGroundFound = await Campground.findById(id).populate("reviews");

      /** This line will prevent an error for not found the campground */
      if (!campGroundFound) {
         // Set a flash message by passing the key, followed by the value, to req.flash().
         req.flash("error", "Campground Not Found");
         return res.redirect("/campgrounds");
      }

      res.render("show", { campGroundFound });
   })
);

// Delete a campground
router.delete(
   "/:id",
   catchAsync(async (req, res) => {
      const { id } = req.params;
      const deletedCampground = await Campground.findByIdAndDelete(id);
      // Set a flash message by passing the key, followed by the value, to req.flash().
      req.flash("success", "Successfully delete a campground!");
      res.redirect("/campgrounds");
   })
);

module.exports = router;
