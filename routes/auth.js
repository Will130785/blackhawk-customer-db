const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("../models/user");
const middleware = require("../middleware/index");

//INDEX
router.get("/", (req, res, next) => {
    res.render("auth/landing");
});

//LOGIN
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

//PROCESS LOGIN
router.post("/login", passport.authenticate("local",
{
    successRedirect: "/menu",
    failureRedirect: "/login"
}), (req, res) => {
});

//REGISTER NEW USER FORM
router.get("/register", middleware.isLoggedIn, (req, res, next) => {
    res.render("auth/register");
});

router.post("/register", middleware.isLoggedIn, (req, res, next) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        }
        req.flash("success", "User added");
        res.redirect("/customers");
    });
});

//LOGOUT ROUTE
router.get("/logout", (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out");
    res.redirect("/");
});

module.exports = router;