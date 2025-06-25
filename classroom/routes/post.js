const express = require("express");
const router = express.Router(); // import express router method() from express

// Posts - Users
// index 
router.get("/", (req,res) =>{ 
    res.send("GET for post");
});

// Show 
router.get("/:id", (req,res) =>{ 
    res.send("GET for post id");
});
// Post 
router.post("/", (req,res) =>{ 
    res.send("POST for posts");
});
// Delete 
router.delete("/:id", (req,res) =>{ 
    res.send("DELETE for post id");
});

module.exports = router;
