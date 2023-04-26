const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas/schemas");
const Review = require(`./review`);
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
   title: String,
   price: Number,
   description: String,
   location: String,
   image: String,
   // this will make a realtionship with the review schema(one way relation)
   reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

CampgroundSchema.post(`findOneAndDelete`, async function (doc) {
   if (doc) {
      await Review.deleteMany({
         _id: {
            $in: doc.reviews,
         },
      });
   }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
