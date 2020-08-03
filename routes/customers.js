const express = require("express");
const router = express.Router();

//SHOW ALL CUSTOMERS
router.get("/", (req, res, next) => {
    res.send("This page will display all customers");
});

//CREATE NEW CUSTOMER
router.post("/", (req, res, next) => {
    res.send("This will be the post route");
});

//SHOW FORM TO CREATE NEW CUSTOMER
router.get("/new", (req, res, next) => {
    res.send("This will be the form to add a new customer");
});

//SHOW INDIVIDUAL CUSTOMER RECORD
router.get("/:id", (req, res, next) => {
    res.send("This will be an individual customer record");
});

//EDIT RECORD
router.get("/:id/edit", (req, res, next) => {
    res.send("This will be the edit record page");
});

//UPDATE RECORD
router.put("/:id", (req, res, next) => {
    res.send("This will update a customer record");
});

//DESTROY RECORD
router.delete("/:id", (req, res, next) => {
    res.send("This will be the route to delete a record");
});

module.exports = router;