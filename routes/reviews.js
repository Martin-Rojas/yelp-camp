const express = require("express");
/* working with Router express sometimes has a perate params
   but using the property mergeParams will fix that issue.*/
const router = express.Router({ mergeParams: true });
const { campgroundSchema, reviewSchema } = require("../schemas/schemas");
const Campground = require("../models/campGround");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

// Utils
const ExpressError = require("../utils/expressErrors");
const catchAsync = require("../utils/catchAsync");

// It will check for error before a review is made.
const validateReview = (req, rex, next) => {
   const { error } = reviewSchema.validate(req.body);

   if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
};

// route for the creation of a review.
router.post(
   "/",
   validateReview,
   isLoggedIn,
   catchAsync(async (req, res) => {
      const { id } = req.params;

      const campGroundFound = await Campground.findById(id);
      const review = new Review(req.body.review);
      // it will save the auhor id into review field of author.
      review.author = req.user._id;
      campGroundFound.reviews.push(review);

      await review.save();
      await campGroundFound.save();

      // Set a flash message by passing the key, followed by the value, to req.flash().
      req.flash("success", "Successfully create a review!");

      res.redirect(`/campgrounds/${campGroundFound._id}`);
   })
);

// Delete a single review
router.delete(
   `/:reviewId`,
   isLoggedIn,
   isReviewAuthor,
   catchAsync(async (req, res) => {
      const { id, reviewId } = req.params;

      // $pull will find all instances that matches reviewId and removes them.
      await Campground.findByIdAndUpdate(
         id,
         { $pull: { reviews: reviewId } },
         { runValidators: true, new: true }
      );
      await Review.findByIdAndDelete(reviewId);

      // Set a flash message by passing the key, followed by the value, to req.flash().
      req.flash("success", "Successfully delete a review!");

      res.redirect(`/campgrounds/${id}`);
   })
);

module.exports = router;
