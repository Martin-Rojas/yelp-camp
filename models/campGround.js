const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas/schemas");
const Review = require(`./review`);
const Schema = mongoose.Schema;

//https://res.cloudinary.com/drzfeh8fk/image/upload/w_200/v1684458171/YelpCamp/zrjwhnuyf58cpbjffs3d.jpg

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual(`thumbnail`).get(function () {
   return this.url.replace(`/upload`, `/upload/w_200`);
});

ImageSchema.virtual(`thumbnail2`).get(function () {
   return this.url.replace(`/upload`, `/upload/w_400`);
});

const CampgroundSchema = new Schema({
   title: String,
   price: Number,
   description: String,
   location: String,
   geometry: {
      type: {
         type: String,
         enum: ["Point"],
         required: true,
      },
      coordinates: {
         type: [Number],
         required: true,
      },
   },
   images: [ImageSchema],
   author: { type: Schema.Types.ObjectId, ref: "User" },
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
