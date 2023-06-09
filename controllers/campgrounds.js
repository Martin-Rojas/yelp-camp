const Campground = require("../models/campGround");
const mbxGoecoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGoecoding({ accessToken: mapBoxToken });

const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
   const campgrounds = await Campground.find({});
   res.render("campgrounds", { campgrounds });
};

module.exports.newCampgroundForm = (req, res) => {
   res.render("new");
};

module.exports.createCampground = async (req, res, next) => {
   const geoData = await geocoder
      .forwardGeocode({
         query: req.body.campground.location,
         limit: 1,
      })
      .send();

   const newCampground = new Campground(req.body.campground);
   newCampground.images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
   }));
   newCampground.geometry = geoData.body.features[0].geometry;

   // It will add the current user as the author of the campground.
   newCampground.author = req.user._id;
   await newCampground.save();
   console.log(newCampground);

   // Set a flash message by passing the key, followed by the value, to req.flash().
   req.flash("success", "Successfully create a campground!");
   res.redirect(`/campgrounds/${newCampground._id}`);
};
module.exports.editCampground = async (req, res) => {
   const { id } = req.params;
   const campGroundFound = await Campground.findById(id);
   /** This line will prevent an error for not found the campground */
   if (!campGroundFound) {
      // Set a flash message by passing the key, followed by the value, to req.flash().
      req.flash("error", "Campground Not Found");
      return res.redirect("/campgrounds");
   }
   res.render("edit", { campGroundFound });
};

module.exports.updateCampground = async (req, res) => {
   const campGroundEdited = await Campground.findByIdAndUpdate(req.params.id, {
      // copies all properties
      ...req.body.campground,
   });

   // create an array of imgs
   const imgs = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
   }));

   // Use the spread operator to add the new images to an exixting array of images.
   campGroundEdited.images.push(...imgs);
   await campGroundEdited.save();

   // Deleting images
   if (req.body.deleteImages) {
      // Delete from cloudinary
      for (let filename of req.body.deleteImages) {
         await cloudinary.uploader.destroy(filename);
      }
      // delete from mongoDB
      await campGroundEdited.updateOne({
         $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
   }

   req.flash("success", "Successfully updated campground");
   res.redirect(`/campgrounds/${campGroundEdited._id}`);
};

module.exports.showCampground = async (req, res, next) => {
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
};

module.exports.deleteCampground = async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndDelete(id);
   // Set a flash message by passing the key, followed by the value, to req.flash().
   req.flash("success", "Successfully delete a campground!");
   res.redirect("/campgrounds");
};
