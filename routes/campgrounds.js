const express = require("express");
const router = express.Router();
const { campgroundSchema, reviewSchema } = require("../schemas/schemas");
const Campground = require("../models/campGround");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressErrors");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campground = require("../controllers/campgrounds");

// Show all campgrounds
router.get("/", catchAsync(campground.index));

// show form to create a new campground
router.get("/new", isLoggedIn, campground.newCampgroundForm);

// Create a new campground
router.post(
   "/",
   isLoggedIn,
   validateCampground,
   catchAsync(campground.createCampground)
);

// Edit campground
router.get("/:id/edit", isAuthor, catchAsync(campground.editCampground));

// Update a campground
router.put("/:id", isAuthor, catchAsync(campground.updateCampground));

// Show a campground
router.get("/:id", catchAsync(campground.showCampground));

// Delete a campground
router.delete("/:id", isAuthor, catchAsync(campground.deleteCampground));

module.exports = router;
