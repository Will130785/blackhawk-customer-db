const mongoose = require("mongoose");

//Schema set up
const customerSchema = new mongoose.Schema({
    name: String,
    code: Number,
    phone: Number,
    email: String,
    address: String,
    oven: String,
    price: String,
    time: Object,
    date: Object, 
    notes: String,
    dateAdded: Object,
    chaseDate: Object
});

module.exports = mongoose.model("Customer", customerSchema);