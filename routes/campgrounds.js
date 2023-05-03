const express = require("express");
const router = express.Router();
const { campgroundSchema, reviewSchema } = require("../schemas/schemas");
const Campground = require("../models/campGround");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressErrors");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

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
   isLoggedIn,
   validateCampground,
   catchAsync(async (req, res, next) => {
      const newCampground = new Campground(req.body.campground);
      // It will add the current user as the author of the campground.
      newCampground.author = req.user._id;
      await newCampground.save();
      // Set a flash message by passing the key, followed by the value, to req.flash().
      req.flash("success", "Successfully create a campground!");
      res.redirect(`/campgrounds/${newCampground._id}`);
   })
);

// Edit campground
router.get(
   "/:id/edit",
   isAuthor,
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
   isAuthor,
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
   })
);

// Delete a campground
router.delete(
   "/:id",
   isAuthor,
   catchAsync(async (req, res) => {
      const { id } = req.params;
      const deletedCampground = await Campground.findByIdAndDelete(id);
      // Set a flash message by passing the key, followed by the value, to req.flash().
      req.flash("success", "Successfully delete a campground!");
      res.redirect("/campgrounds");
   })
);

module.exports = router;
