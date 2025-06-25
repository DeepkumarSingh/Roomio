const User = require("../models/user");

module.exports.renderSignupForm =  (req,res) =>{
    res.render("users/signup.ejs");
}
module.exports.signup = async(req , res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser =  new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Roomio");
            res.redirect("/listings");
        });
    } catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};
// module.exports.signup = async (req, res, next) => {
//     try {
//         const { username, email, password } = req.body;
//         const user = new User({ username, email });
//         if (req.file) {
//             user.profilePic = '/images/profiles/' + req.file.filename;
//         }
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err);
//             req.flash('success', 'Welcome!');
//             res.redirect('/listings');
//         });
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('/signup');
//     }
// };

module.exports.renderloginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
        // req.flash("success","Welcome to Roomio You are logged in 👍🏻");
        req.flash("success", 'Welcome to Roomio <i class="fa-solid fa-handshake fa-xl" style="color:#ff6347;"></i>');
        let redirectUrl = res.locals.redirectUrl;
        if(redirectUrl){
            res.redirect(redirectUrl);
        }
        else{
            res.redirect("/listings");
        }
};

module.exports.logout = (req,res,next)=>{
    req.logout((err) =>{
        if(err){
            return next();
        }
        // req.flash("success","You are logged out ☺️");
        req.flash("success", 'You are logged out <i class="fa-solid fa-face-smile-wink fa-lg" style ="color:#ff6347;"></i>');
        res.redirect("/listings");
    })
};
