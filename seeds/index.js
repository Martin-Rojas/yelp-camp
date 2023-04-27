const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedsHelpers");
const Campground = require("../models/campground");

mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
   await Campground.deleteMany({});
   for (let i = 0; i < 50; i++) {
      const random1000 = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 20) + 10;
      const camp = new Campground({
         author: "642388b7e7dd8de7c3c89971",
         location: `${cities[random1000].city}, ${cities[random1000].state}`,
         title: `${sample(descriptors)} ${sample(places)}`,
         image: "https://source.unsplash.com/random/900%C3%97700/?campgrounds",
         description:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus saepe voluptatem reprehenderit in aut amet at quis facere. Fugiat mollitia quos soluta excepturi dicta assumenda esse doloribus nobis ipsam natus?",
         price,
      });
      await camp.save();
   }
};

seedDB().then(() => {
   mongoose.connection.close();
});
