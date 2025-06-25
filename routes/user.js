const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const multer = require('multer');
const path = require('path');

const userController = require("../controllers/user.js");

// Multer setup for profile picture uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/profiles'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(upload.single('profilePic'), wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderloginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: '/login',
            failureFlash: true
        }),
        userController.login
    );

router.get("/logout", userController.logout);

module.exports = router;