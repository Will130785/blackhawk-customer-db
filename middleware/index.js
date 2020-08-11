const Customer = require("../models/customer");

const middlewareObj = {
    isLoggedIn(req, res, next){
        if(req.isAuthenticated()) {
            return next();
        }
        console.log("You need to be logged in");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;