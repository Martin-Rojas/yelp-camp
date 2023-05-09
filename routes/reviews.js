const express = require("express");
/* working with Router express sometimes has a perate params
   but using the property mergeParams will fix that issue.*/
const router = express.Router({ mergeParams: true });
// const { campgroundSchema, reviewSchema } = require("../schemas/schemas");
// const Campground = require("../models/campGround");
// const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");
const review = require("../controllers/reviews");

// Utils
const catchAsync = require("../utils/catchAsync");

// route for the creation of a review.
router.post("/", validateReview, isLoggedIn, catchAsync(review.createReview));

// Delete a single review
router.delete(
   `/:reviewId`,
   isLoggedIn,
   isReviewAuthor,
   catchAsync(review.deleteReview)
);

module.exports = router;
