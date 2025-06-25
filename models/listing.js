const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  roomType : String,
  numBeds : Number,
  reviews:[
    {
      type : Schema.Types.ObjectId, // this is a reference to the Review model
      ref : "Review", // this is the name of the model we are referencing
    },
  ],
  owner : {
      type: Schema.Types.ObjectId,
      ref : "User",
  },
  geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  
},{ timestamps: true });

/* This code snippet is setting up a post middleware function on the `listingSchema` schema in
Mongoose. Specifically, it is targeting the `findOneAndDelete` operation, which is triggered when a
document is found and deleted using a query. */

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
      await Review.deleteMany({_id : {$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;