const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id); // find the listing by using the id
    let newReview = new Review(req.body.review); // create a new review
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview); // push the new review into the listing's reviews array
    await newReview.save(); // save the new review
    await listing.save(); // save the listing with the new review(i.e existing listing)
    req.flash("success", "New Review created 👍🏻");
    res.redirect(`/listings/${listing._id}`); // redirect to the listing's show page
};

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : { reviews : reviewId}}); // remove the review from the listing's reviews array
    await Review.findByIdAndDelete(reviewId); // delete the review
    req.flash("success", "Review Deleted 👍🏻");
    res.redirect(`/listings/${id}`); // redirect to the listing's show page
}; 