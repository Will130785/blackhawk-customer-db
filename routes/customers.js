const express = require("express");
const router = express.Router();
const moment = require("moment");
const schedule = require("node-schedule");
const Helpers = require("../methods/index");
const Customer = require("../models/customer");
const middleware = require("../middleware/index");


//SHOW ALL CUSTOMERS
router.get("/", middleware.isLoggedIn, (req, res, next) => {
    
    //Get all customers from DB
    Customer.find({}, (err, allCustomers) => {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {customers: allCustomers});
        }
    })
});

//CREATE NEW CUSTOMER
router.post("/", middleware.isLoggedIn, (req, res, next) => {
    // const newDate = moment().add(1, 'days');
    // const formatted = moment(newDate).format("L");
    //Create new customer object
    let newCustomer = {
        name: req.body.name,
        code: req.body.code,
        phone: req.body.phone,
        // email: req.body.email,
        address: req.body.address,
        oven: req.body.oven,
        price: req.body.price,
        time: req.body.time,
        date: req.body.date,
        notes: req.body.notes,
        dateAdded: moment().format('L'),
        chaseDate: moment().add(180, 'days').calendar()
        // chaseDate: "08/12/2020"
        // chaseDate: moment().format('L')
    }

    //Create new database entry
    Customer.create(newCustomer, (err, newlyCreatedCustomer) => {
        if(err) {
            console.log(err);
        } else {
            //Create new customer text object
            const textDetails = {
                name: newlyCreatedCustomer.name,
                code: newlyCreatedCustomer.code,
                phone: newlyCreatedCustomer.phone,
                // email: newlyCreatedCustomer.email,
                address: newlyCreatedCustomer.address,
                oven: newlyCreatedCustomer.oven,
                price: newlyCreatedCustomer.price,
                time: newlyCreatedCustomer.time,
                date: newlyCreatedCustomer.date
            }

            if(newlyCreatedCustomer.phone) {
                Helpers.sendSMS(textDetails);
                req.flash("success", "Customer successfully added and text message sent");
                res.redirect("/customers");
            } else {
                req.flash("success", "Customer successfully added");
                res.redirect("/customers");
            }
        }
    });
});

//SHOW FORM TO CREATE NEW CUSTOMER
router.get("/new", middleware.isLoggedIn, (req, res, next) => {
    res.render("new");
});

//SEARCH FOR CUSTOMER PAGE
router.get("/search", middleware.isLoggedIn, (req, res, next) => {
    res.render("search");
});

//SEARCH DATABASE FOR CUSTOMER
router.post("/search/customer", middleware.isLoggedIn, (req, res, next) => {
    Customer.find({name: req.body.search}, (err, foundCustomer) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            if(foundCustomer.length > 0) {
                res.render("individual", {customer: foundCustomer});
            } else {
                req.flash("error", "Sorry, no match was found, please ensure spelling of name is 100% correct");
                res.redirect("/customers/search");
            }
        }
    });
})

//SHOW INDIVIDUAL CUSTOMER RECORD
router.get("/:id", middleware.isLoggedIn, (req, res, next) => {
    //Find customer with provided id
    Customer.findById(req.params.id, (err, foundCustomer) => {
        console.log(foundCustomer);
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            res.render("show", {customer: foundCustomer});
        }
    });
});

//EDIT RECORD
router.get("/:id/edit", middleware.isLoggedIn, (req, res, next) => {
    //Find customer
    Customer.findById(req.params.id, (err, foundCustomer) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            res.render("edit", {customer: foundCustomer});
        }
    });
});

//UPDATE RECORD
router.put("/:id", middleware.isLoggedIn, (req, res, next) => {
    //Get form data and create updated note object
    const updatedCustomer = {
        name: req.body.name,
        code: req.body.code,
        phone: req.body.phone,
        // email: req.body.email,
        address: req.body.address,
        oven: req.body.oven,
        notes: req.body.notes,
        price: req.body.price,
        time: req.body.time,
        date: req.body.date
    }
    Customer.findByIdAndUpdate(req.params.id, updatedCustomer, (err, updatedCustomer) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            req.flash("success", "Record updated");
            res.redirect(`/customers/${req.params.id}`);
        }
    });
});

//DESTROY RECORD
router.delete("/:id", middleware.isLoggedIn, (req, res, next) => {
    Customer.findByIdAndRemove(req.params.id, (err, customer) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong, please try again");
        } else {
            customer.remove();
            req.flash("success", "Record deleted");
            res.redirect("/customers");
        }
    });
});


module.exports = router;