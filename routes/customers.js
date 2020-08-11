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
    //Create new customer object
    let newCustomer = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        oven: req.body.oven,
        notes: req.body.notes,
        dateAdded: moment().format('L'),
        // chaseDate: moment().add(10, 'days').calendar()
        chaseDate: moment().format('L')
    }

    //Create new database entry
    Customer.create(newCustomer, (err, newlyCreatedCustomer) => {
        if(err) {
            console.log(err);
        } else {
            console.log(newlyCreatedCustomer);
            Helpers.sendSMS();
            console.log("SMS sent");
            res.redirect("/customers");
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
        } else {
            console.log(foundCustomer[0]);
            res.render("individual", {customer: foundCustomer});
        }
    });
})

//SHOW INDIVIDUAL CUSTOMER RECORD
router.get("/:id", middleware.isLoggedIn, (req, res, next) => {
    //Find customer with provided id
    Customer.findById(req.params.id, (err, foundCustomer) => {
        if(err) {
            console.log(err);
        } else {
             console.log(foundCustomer);
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
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        oven: req.body.oven,
        notes: req.body.notes
    }
    Customer.findByIdAndUpdate(req.params.id, updatedCustomer, (err, updatedCustomer) => {
        if(err) {
            console.log(err);
        } else {
            console.log(req.body);
            res.redirect(`/customers/${req.params.id}`);
        }
    });
});

//DESTROY RECORD
router.delete("/:id", middleware.isLoggedIn, (req, res, next) => {
    Customer.findByIdAndRemove(req.params.id, (err, customer) => {
        if(err) {
            console.log(err);
        } else {
            customer.remove();
            res.redirect("/customers");
        }
    });
});


module.exports = router;