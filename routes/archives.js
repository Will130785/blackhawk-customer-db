const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index");
const Helpers = require("../methods/index");
const Booking = require("../models/booking");
const Archive = require("../models/archive");
const moment = require("moment");

router.get("/", middleware.isLoggedIn, (req, res, next) => {
    //Get all customers from DB
    Archive.find({}, null, {sort: {date: 1}}, (err, allArchives) => {
        if(err) {
            console.log(err);
        } else {
            res.render("archives/archive", {archives: allArchives});
        }
    })
});

//SHOW INDIVIDUAL CUSTOMER RECORD
router.get("/:id", middleware.isLoggedIn, (req, res, next) => {
    //Find customer with provided id
    Archive.findById(req.params.id, (err, foundArchive) => {
        console.log(foundArchive);
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            res.render("archives/show", {archive: foundArchive});
        }
    });
});

//DESTROY RECORD
router.delete("/:id", middleware.isLoggedIn, (req, res, next) => {
    Archive.findByIdAndRemove(req.params.id, (err, archive) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            archive.remove();
            req.flash("success", "Archive removed");
            res.redirect("/archives");
        }
    });
});

module.exports = router;