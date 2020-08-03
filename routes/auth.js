const express = require("express");
const router = express.Router();

//INDEX
router.get("/", (req, res, next) => {
    res.render("landing");
});

//PROCESS LOGIN
router.post("/login", (req, res, next) => {
    res.send("This will check the login credentials");
});

//REGISTER NEW USER FORM
router.get("/register", (req, res, next) => {
    res.render("register");
});

//CREATE NEW USEER
router.post("/register", (req, res, next) => {
    res.send("This will be the new user post Route");
});

//LOGOUT ROUTE
router.get("/logout", (req, res, next) => {
    res.redirect("/");
});

module.exports = router;