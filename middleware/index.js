const Customer = require("../models/customer");
const flash = require("connect-flash");

const middlewareObj = {
    isLoggedIn(req, res, next){
        if(req.isAuthenticated()) {
            return next();
        }
        console.log("You need to be logged in");
        req.flash("error", "You need to be signed in to do that")
        res.redirect("/login");
    }
}

module.exports = middlewareObj;