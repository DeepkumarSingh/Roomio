if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
app.use(express.static('public'));
const mongoose = require("mongoose");
const path = require("path");
const methodOveride = require("method-override");
const ejsMate =  require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session"); // session middleware
const MongoStore = require('connect-mongo');
const flash = require("connect-flash"); // flash middleware
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { preferences } = require('joi');

const dbUrl = process.env.ATLASDB_URL;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); // to parse our request data
app.use(methodOveride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
  console.log("Error in mongo session store",err);
});

const sessionOption  = {
    store,
    secret : process.env.SECRET,
    resave  : false,
    saveUninitialized : true,
    cookie : {
      expires : Date.now() + 7*24*60*60*1000, // 7 days -> 1000 is used to convert ms to s. 
      maxAge :  7*24*60*60*1000,
      httpOnly : true, // helps to prevent cross site scripting attacks
    },
  };

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOption));
app.use(flash()); // use flash middleware

app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouter); // use the listings router for all routes starting with /listings

app.use("/listings/:id/reviews", reviewRouter); // use the reviews router for all routes starting with /listings/:id/reviews

app.use("/",userRouter);

/* This code snippet is creating a catch-all route using `app.all("*", (req, res, next) => { next(new
ExpressError(404, "Page Not Found!")) });`. */
app.all("*",(req,res,next)=>{
  // console.log(`Page not found for URL: ${req.originalUrl}`);
  next(new ExpressError(404,"Page Not Found!"))
});

app.use((err, req, res, next) => {
  let {statusCode=500,message="Something went wrong👎"} = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});



//Notes part-

// Note - /* `Use of Joi` is a reference or a note indicating that the code may be utilizing the Joi
// library for data validation. Joi is a popular library in the Node.js ecosystem used for
// validating and sanitizing data. It provides a simple and powerful way to validate data
// before processing it further in your application.

// Note - Validation for reviews is not implemented yet.
// first we do 1. client side validation, 2. then we do server side validation
