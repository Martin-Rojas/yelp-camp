const Campground = require("../models/campGround");
const Review = require("../models/review");

// Create a new review
module.exports.createReview = async (req, res) => {
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
};

// Delete review
module.exports.deleteReview = async (req, res) => {
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
};
