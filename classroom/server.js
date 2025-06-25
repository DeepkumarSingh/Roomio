const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions = {
        secret: "mysupersecretstring" , 
        resave : false, 
        saveUninitialized: true,
    };

app.use(session(sessionOptions));// middleware to use session
app.use(flash()); // middleware to use flash messages

// best way to use flash messages is to use it after session middleware(like below)
app.use((req,res,next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next(); 
});

app.get("/register" , (req,res) =>{
    let {name ="anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "User not registered");
    }
    else{
        req.flash("success", "User registered successfully");
    }
    res.redirect("/hello");
});

app.get("/hello" ,(req,res) =>{
    res.render("page.ejs", {name : req.session.name}); 
})

app.get("/test", (req, res) =>{
    res.send("test successful");
});

app.listen(3000, () =>{
    console.log("server is listening on port 3000");
});



// What is state?
// State is a way to store data that can change over time.
//  In web applications, state is often used to keep track of user interactions, 
// such as form submissions, button clicks, and other events. State can be stored
//  in various ways, including in memory, in a database, or in cookies. 

// types of state protocol ?
// 1. stateful protocol -> requires the server to remember the state of the client between requests.
// 2. stateless protocol -> does not require the server to remember the state of the client between requests.

// what is Express Session? 
// Express Session is a middleware for Express.js that allows you to store 
// session data on the server side.

// what is res.locals?
/* `res.locals` is an object in Express.js that contains response local variables scoped to the
    request. These local variables are available to the view templates rendered during that
    request/response cycle. */

