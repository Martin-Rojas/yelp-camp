const express = require("express");
const router = express.Router();
const { campgroundSchema, reviewSchema } = require("../schemas/schemas");
const Campground = require("../models/campGround");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressErrors");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const {
   index,
   newCampgroundForm,
   createCampground,
   editCampground,
   updateCampground,
   showCampground,
   deleteCampground,
} = require("../controllers/campgrounds");

// Show all campgrounds
router.get("/", catchAsync(index));

// show form to create a new campground
router.get("/new", isLoggedIn, newCampgroundForm);

// Create a new campground
router.post("/", isLoggedIn, validateCampground, catchAsync(createCampground));

// Edit campground
router.get("/:id/edit", isAuthor, catchAsync(editCampground));

// Update a campground
router.put("/:id", isAuthor, catchAsync(updateCampground));

// Show a campground
router.get("/:id", catchAsync(showCampground));

// Delete a campground
router.delete("/:id", isAuthor, catchAsync(deleteCampground));

module.exports = router;
