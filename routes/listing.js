const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner , validateListing} = require("../middleware.js");

const listingController =  require("../controllers/listings.js");
const multer  = require('multer') // use for multimedia uploadation as a middleware (i.e pdf/jpg/png/jpeg) etc
const { storage } = require("../cloudConfig.js"); 
const upload = multer({ storage }); // setting the destination of the upcoming uploaded files

router    
    .route("/")
    .get(wrapAsync(listingController.index))// -> Index Route & 
    .post(
        isLoggedIn, 
        upload.fields([
            //"listing[image]"),validateListing, wrapAsync(listingController.createListing));//  // Create Route
            { name: "listing[image]", maxCount: 1 },
            { name: "profilePic", maxCount: 1 }
        ]),
        validateListing,
        wrapAsync(listingController.createListing)
);
//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get( wrapAsync(listingController.showListing)) //Show Route
    .put(
        isLoggedIn,
        isOwner,
        upload.fields([
            { name: "listing[image]", maxCount: 1 },
            { name: "profilePic", maxCount: 1 }
        ]),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    //.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))//Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //Delete Route

//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;