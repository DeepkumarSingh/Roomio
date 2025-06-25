const Listing = require("../models/listing");
const mbxGeocoding  = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// };

module.exports.index = async (req, res) => {
    const { city } = req.query;
    let allListings;

    if (city && city.trim() !== "") {
        const searchRegex = new RegExp(city, "i"); // case-insensitive partial match
        allListings = await Listing.find({
            $or: [
                { city: searchRegex },
                { address: searchRegex },
                { location: searchRegex } // just in case you're storing full address
            ]
        }).populate("owner");
    } else {
        allListings = await Listing.find({}).populate("owner");
    }

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    id = id.replace(/^:/, "");
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{path: "author",},
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you are trying to reach does not exist ☠️");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res, next) => {
    try {
        // Get uploaded files
        const roomImage = req.files['listing[image]'] ? req.files['listing[image]'][0] : null;
        const profilePic = req.files['profilePic'] ? req.files['profilePic'][0] : null;

        // Create new listing
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        // Save room image to listing
        if (roomImage) {
            newListing.image = {
                url: roomImage.path, // or roomImage.location if using cloud storage
                filename: roomImage.filename
            };
        }

        // Save profilePic to user if uploaded
        if (profilePic) {
            req.user.profilePic = profilePic.path; // or profilePic.location if using cloud storage
            await req.user.save();
        }

        // Geocode location
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        newListing.geometry = response.body.features[0].geometry;

        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success", "New Listing created 👍🏻");
        res.redirect("/listings");
    } catch (e) {
        next(e);
    }
};
// module.exports.createListing = async (req, res, next) => {
//     // Get uploaded files
//     const roomImage = req.files['listing[image]'] ? req.files['listing[image]'][0] : null;
//     const profilePic = req.files['profilePic'] ? req.files['profilePic'][0] : null;
//     // Create new listing
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     // Save room image to listing
//     if (roomImage) {
//         newListing.image = {
//             url: roomImage.path, // or roomImage.location if using cloud storage
//             filename: roomImage.filename
//         };
//     }
//     // Save profilePic to user if uploaded
//     if (profilePic) {
//         req.user.profilePic = profilePic.path; // or profilePic.location if using cloud storage
//         await req.user.save();
//     }
//     let response = await geocodingClient.forwardGeocode({
//     query: req.body.listing.location, //
//     limit: 1,
//     })
//     .send();

//     // If a single file upload is used (e.g., req.file), update the image as well
//     if (req.file) {
//         newListing.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         };
//     }

//     newListing.geometry = response.body.features[0].geometry;
//     let savedListing = await newListing.save();
//     console.log(savedListing);
//     req.flash("success", "New Listing created 👍🏻");
//     res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res) => {
//     let { id } = req.params;
//     id = id.replace(/^:/, "");
//     const listing = await Listing.findById(id);
//     if(!listing){
//         req.flash("error", "Listing you are trying to reach does not exist ☠️");
//         res.redirect("/listings");
//     }
//     let orignalImageUrl = listing.image.url;
//     orignalImageUrl = orignalImageUrl.replace("/upload","/upload/w_200,e_blur:100");
//     res.render("listings/edit.ejs", { listing, orignalImageUrl });
// };

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {
        listing,
        orignalImageUrl: listing.image ? listing.image.url : "",
        currentUser: req.user // <-- add this line
    });
};

// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
//     if(typeof req.file !== "undefined"){ // if the files exist then we will get the url & filename
//         let url = req.file.path; // get the url path
//         let filename = req.file.filename; // get the filename
//         listing.image = { url, filename };
//         await listing.save(); // now again update the listing
//     }
    
//     req.flash("success", "Listing Updated 👍🏻");
//     res.redirect(`/listings/${id}`);
// };

// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
//     // Geocode the new location
//     const geoResponse = await geocodingClient.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1,
//     }).send();
//     // Update the listing with new data
//     let listing = await Listing.findByIdAndUpdate(id, {
//         ...req.body.listing,
//         geometry: geoResponse.body.features[0].geometry // update geometry
//     });
//     // If a new image was uploaded, update it
//     if (typeof req.file !== "undefined") {
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image = { url, filename };
//         await listing.save();
//     }
//     req.flash("success", "Listing Updated 👍🏻");
//     res.redirect(`/listings/${id}`);
// };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // Geocode the new location
    const geoResponse = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    // Update the listing with new data
    let listing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
        geometry: geoResponse.body.features[0].geometry
    }, { new: true });

    // Handle new room image
    const roomImage = req.files && req.files['listing[image]'] ? req.files['listing[image]'][0] : null;
    if (roomImage) {
        listing.image = {
            url: roomImage.path, // or .location if using cloud storage
            filename: roomImage.filename
        };
        await listing.save();
    }

    // Handle new profile picture
    const profilePic = req.files && req.files['profilePic'] ? req.files['profilePic'][0] : null;
    if (profilePic) {
        req.user.profilePic = profilePic.path; // or .location if using cloud storage
        await req.user.save();
    }

    req.flash("success", "Listing Updated 👍🏻");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted 👍🏻");
    res.redirect("/listings");
};