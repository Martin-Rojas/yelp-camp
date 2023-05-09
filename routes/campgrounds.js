const express = require("express");
const router = express.Router();
const { campgroundSchema, reviewSchema } = require("../schemas/schemas");
const Campground = require("../models/campGround");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressErrors");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campground = require("../controllers/campgrounds");

router
   .route(`/`)
   // Show all campgrounds
   .get(catchAsync(campground.index))
   // Create a new campground
   .post(
      isLoggedIn,
      validateCampground,
      catchAsync(campground.createCampground)
   );

// show form to create a new campground
router.get("/new", isLoggedIn, campground.newCampgroundForm);

// Edit campground
router.get("/:id/edit", isAuthor, catchAsync(campground.editCampground));

router
   // All have same path
   .route(`/:id`)
   // Show a campground
   .get(catchAsync(campground.showCampground))
   // Update a campground
   .put(isAuthor, catchAsync(campground.updateCampground))
   // Delete a campground
   .delete(isAuthor, catchAsync(campground.deleteCampground));

module.exports = router;
