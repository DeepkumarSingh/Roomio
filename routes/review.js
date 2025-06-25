const express = require("express");
const router = express.Router({mergeParams:true}); // mergeParams is used to merge the params of the parent route with the child route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview , isLoggedIn, isReviewAuthor } =  require("../middleware.js");

const reviewController = require("../controllers/review.js");
// Post Review Route
    router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

  // Delete Review Route
    router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router; // export the router
