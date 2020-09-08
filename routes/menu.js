const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index");

//SHOW MAIN MENU
router.get("/", middleware.isLoggedIn, (req, res, next) => {
    
    //Show main menu
    res.render("menu/menu");
});

//SHOW SEARCH MENU
router.get("/search", middleware.isLoggedIn, (req, res, next) => {
    res.render("menu/searchOptions");
});

module.exports = router;