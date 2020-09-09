const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index");
const Helpers = require("../methods/index");
const Booking = require("../models/booking");
const Reminder = require("../models/reminder");
const moment = require("moment");

router.get("/", middleware.isLoggedIn, (req, res, next) => {
    //Get all customers from DB
    Reminder.find({}, (err, allReminders) => {
        if(err) {
            console.log(err);
        } else {
            res.render("reminders/reminder", {reminders: allReminders});
        }
    })
});

//SHOW INDIVIDUAL CUSTOMER RECORD
router.get("/:id", middleware.isLoggedIn, (req, res, next) => {
    //Find customer with provided id
    Reminder.findById(req.params.id, (err, foundReminder) => {
        console.log(foundReminder);
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            res.render("reminders/show", {reminder: foundReminder});
        }
    });
});

//DESTROY RECORD
router.delete("/:id", middleware.isLoggedIn, (req, res, next) => {
    Reminder.findByIdAndRemove(req.params.id, (err, reminder) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            reminder.remove();
            req.flash("success", "Reminder actioned");
            res.redirect("/reminders");
        }
    });
});

module.exports = router;