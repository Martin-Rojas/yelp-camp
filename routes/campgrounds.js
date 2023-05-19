const express = require("express");
const router = express.Router();
const { campgroundSchema, reviewSchema } = require("../schemas/schemas");
const Campground = require("../models/campGround");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressErrors");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campground = require("../controllers/campgrounds");
const { storage } = require(`../cloudinary`);
const multer = require("multer");
const upload = multer({ storage });

router
   .route(`/`)
   // Show all campgrounds
   .get(catchAsync(campground.index))
   //Create a new campground
   .post(
      isLoggedIn,
      upload.array(`image`),
      validateCampground,
      catchAsync(campground.createCampground)
   );

// show form to create a new campground
router.get("/new", isLoggedIn, campground.newCampgroundForm);

// Edit campground
router.get(
   "/:id/edit",
   isLoggedIn,
   isAuthor,
   catchAsync(campground.editCampground)
);

router
   // All have same path
   .route(`/:id`)
   // Show a campground
   .get(catchAsync(campground.showCampground))
   // Update a campground
   .put(
      isLoggedIn,
      isAuthor,
      upload.array(`image`),
      validateCampground,
      catchAsync(campground.updateCampground)
   )
   // Delete a campground
   .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

module.exports = router;
