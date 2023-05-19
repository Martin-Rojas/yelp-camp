if (process.env.NODE_ENV !== `production`) {
   require(`dotenv`).config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const expressError = require("./utils/expressErrors");

// requires the model with Passport-Local Mongoose plugged in
const User = require("./models/user");

// Routes
const userRoutes = require(`./routes/users`);
const campgroundRoutes = require(`./routes/campgrounds`);
const reviewsRoutes = require(`./routes/reviews`);

mongoose.set("strictQuery", true);

mongoose
   .connect(`mongodb://127.0.0.1:27017/yelp-camp`)
   .then(console.log("connected"));

const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
   secret: `thisshouldbeabettersecret`,
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
   },
};

app.use(session(sessionConfig));
app.use(flash());

//Middleware is required to inizilize passport.
app.use(passport.initialize());

// if we want our app to use persistent login sesions, we must use this middleware
// and must be after the session() middleware.
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
// How to get a user in a session
passport.serializeUser(User.serializeUser());

// How to get a user out a session
passport.deserializeUser(User.deserializeUser());

// This middleware is to access the local params
// that we store it in form flash
// I have access to this variables from everywhere in my application.
app.use((req, res, next) => {
   res.locals.success = req.flash(`success`);
   res.locals.error = req.flash(`error`);
   res.locals.currentUser = req.user;
   next();
});

// fake user
app.get("/fakeUser", async (req, res) => {
   const user = new User({ email: "rojas@gmail.com", username: "Rojas25" });
   const newUser = await User.register(user, "chicken");
   res.send(newUser);
});

// This middleware is use to access to the campgrounds routes.
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
   res.render("home");
});

app.all("*", (req, res, next) => {
   next(new expressError("Page Not Found", 400));
});

// Error middleware
app.use((err, req, res, next) => {
   const { statusCode = 500 } = err;
   if (!err.message) err.message = `Something went wrong!!!`;
   res.status(statusCode).render("error", { err });
});

app.listen(3000, () => console.log("Listen in port 3000 YelpCamp"));
