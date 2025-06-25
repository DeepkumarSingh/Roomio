const express = require("express");
const router = express.Router(); // import express router method() from express

// index - Users 
router.get("/", (req,res) =>{ 
    res.send("GET for users");
});

// Show - users
router.get("/:id", (req,res) =>{ 
    res.send("GET for user id");
});
// Post - users
router.post("/", (req,res) =>{ 
    res.send("POST for users");
});
// Delete - users
router.delete("/:id", (req,res) =>{ 
    res.send("DELETE for users id");
});

module.exports = router; // export the router object 
// -> here router is an object of express.Router() method
