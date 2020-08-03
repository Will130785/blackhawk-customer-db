const express = require("express");
const router = express.Router();

//INDEX
router.get("/", (req, res, next) => {
    res.render("landing");
});

//REGISTER NEW USER FORM
router.get("/register", (req, res, next) => {
    res.send("This will be the register a new user page");
});

//CREATE NEW USEER
router.post("/register", (req, res, next) => {
    res.send("This will be the new user post Route");
});

//LOGIN FORM
router.get("/login", (req, res, next) => {
    res.send("THis will be the log in page");
});

//PROCESS LOGIN
router.post("/login", (req, res, next) => {
    res.send("This will check the login credentials");
});

//LOGOUT ROUTE
router.get("/logout", (req, res, next) => {
    res.send("This will log the user out");
});

module.exports = router;