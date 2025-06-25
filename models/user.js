// const { string } = require("joi");
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new Schema({
//     email : {
//         type : String,
//         required : true,
//     },
//     // passport-local-mongoose will automatically add a username + password (added with hash func + salting)
// });

// userSchema.plugin(passportLocalMongoose); // very important to add this step
// module.exports = mongoose.model('User', userSchema);

const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "/images/default-profile.jpg" // path to your default image
    }
    // passport-local-mongoose will automatically add a username + password (added with hash func + salting)
});

userSchema.plugin(passportLocalMongoose); // very important to add this step
module.exports = mongoose.model('User', userSchema);