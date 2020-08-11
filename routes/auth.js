const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("../models/user");
const middleware = require("../middleware/index");

//INDEX
router.get("/", (req, res, next) => {
    res.render("landing");
});

//LOGIN
router.get("/login", (req, res, next) => {
    res.render("login");
});

//PROCESS LOGIN
router.post("/login", passport.authenticate("local",
{
    successRedirect: "/customers",
    failureRedirect: "/login"
}), (req, res) => {
    console.log("You have been logged in");
});

// router.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/' }),
//   function(req, res) {
//     res.redirect('/customers');
//   });

//REGISTER NEW USER FORM
router.get("/register", middleware.isLoggedIn, (req, res, next) => {
    res.render("register");
});

router.post("/register", middleware.isLoggedIn, (req, res, next) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
        }
        // passport.authenticate("local")(req, res, () => {
        //     res.redirect("/customers");
        // });
        res.redirect("/customers");
    });
});

//LOGOUT ROUTE
router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;