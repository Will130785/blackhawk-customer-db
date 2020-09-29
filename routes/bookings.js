const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index");
const Helpers = require("../methods/index");
const Booking = require("../models/booking");
const moment = require("moment");

router.get("/", middleware.isLoggedIn, (req, res, next) => {
    //Get all customers from DB
    Booking.find({}, null, {sort: {date: 1}}, (err, allBookings) => {
        if(err) {
            console.log(err);
        } else {
            res.render("booking/booking", {bookings: allBookings});
        }
    })
})

//CREATE NEW BOOKING
router.post("/", middleware.isLoggedIn, (req, res, next) => {
    const remindDate = moment(req.body.date).subtract(2, 'days');
    const formatted = moment(remindDate).format("L");
    const newDate = req.body.date;
    const otherFormatted = moment(newDate).format("L");
    //Create new customer object
    let newBooking = {
        name: req.body.name,
        code: req.body.code,
        phone: req.body.phone,
        address: req.body.address,
        post: req.body.post,
        type: req.body.type,
        price: req.body.price,
        time: req.body.time,
        date: req.body.date,
        tech: req.body.tech,
        color: req.body.color,
        email: req.body.email,
        details: req.body.details,
        dateAdded: moment().format('L'),
        chaseDate: moment(otherFormatted).add(180, 'days').calendar(),
        // chaseDate: otherFormatted,
        reminderDate: formatted
        // chaseDate: "08/12/2020"
        // chaseDate: moment().format('L')
    }

    console.log(newBooking.chaseDate);

    //Create new database entry
    Booking.create(newBooking, (err, newlyCreatedBooking) => {
        if(err) {
            console.log(err);
        } else {
            //Create new customer text object
            const textDetails = {
                name: newlyCreatedBooking.name,
                code: newlyCreatedBooking.code,
                phone: newlyCreatedBooking.phone,
                // email: newlyCreatedCustomer.email,
                address: newlyCreatedBooking.address,
                post: newlyCreatedBooking.post,
                type: newlyCreatedBooking.type,
                price: newlyCreatedBooking.price,
                time: newlyCreatedBooking.time,
                date: newlyCreatedBooking.date
            }

            if(newlyCreatedBooking.phone) {
                Helpers.sendSMS(textDetails);
                req.flash("success", "Booking successfully added and text message sent");
                res.redirect("/bookings");
            } else {
                req.flash("success", "Booking successfully added");
                res.redirect("/bookings");
            }
        }
    });
});

//SHOW FORM TO CREATE NEW BOOKING
router.get("/new", middleware.isLoggedIn, (req, res, next) => {
    res.render("booking/new");
});

//SEARCH FOR CUSTOMER PAGE
router.get("/search", middleware.isLoggedIn, (req, res, next) => {
    res.render("booking/search");
});

//SEARCH DATABASE FOR BOOKING
router.post("/search/booking", middleware.isLoggedIn, (req, res, next) => {
    Booking.find({name: req.body.search}, (err, foundBooking) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            if(foundBooking.length > 0) {
                res.render("booking/individual", {bookings: foundBooking});
            } else {
                req.flash("error", "Sorry, no match was found, please ensure spelling of name is 100% correct");
                res.redirect("/bookings/search");
            }
        }
    });
});

//SHOW INDIVIDUAL CUSTOMER RECORD
router.get("/:id", middleware.isLoggedIn, (req, res, next) => {
    //Find customer with provided id
    Booking.findById(req.params.id, (err, foundBooking) => {
        console.log(foundBooking);
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            res.render("booking/show", {booking: foundBooking});
        }
    });
});

//EDIT RECORD
router.get("/:id/edit", middleware.isLoggedIn, (req, res, next) => {
    //Find customer
    Booking.findById(req.params.id, (err, foundBooking) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            res.render("booking/edit", {booking: foundBooking});
        }
    });
});

//UPDATE RECORD
router.put("/:id", middleware.isLoggedIn, (req, res, next) => {
    //Get form data and create updated note object
    const updatedBooking = {
        name: req.body.name,
        code: req.body.code,
        phone: req.body.phone,
        address: req.body.address,
        post: req.body.post,
        type: req.body.type,
        details: req.body.details,
        price: req.body.price,
        time: req.body.time,
        date: req.body.date,
        tech: req.body.tech,
        color: req.body.color,
        email: req.body.email
    }
    Booking.findByIdAndUpdate(req.params.id, updatedBooking, (err, updatedBooking) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            req.flash("success", "Record updated");
            res.redirect(`/bookings/${req.params.id}`);
        }
    });
});

//DESTROY RECORD
router.delete("/:id", middleware.isLoggedIn, (req, res, next) => {
    Booking.findByIdAndRemove(req.params.id, (err, booking) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            Helpers.addArchive(booking.name, booking.code, booking.phone, booking.address, booking.post, booking.type, booking.price, booking.time, booking.date, booking.tech, booking.color, booking.email, booking.details, booking.dateAdded, booking.chaseDate, booking.reminderDate);
            booking.remove();
            req.flash("success", "Booking complete");
            res.redirect("/bookings");
        }
    });
});

module.exports = router;