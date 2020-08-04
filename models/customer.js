const mongoose = require("mongoose");

//Schema set up
const customerSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    address: String,
    oven: String,
    notes: String,
    dateAdded: Object,
    chaseDate: Object
});

module.exports = mongoose.model("Customer", customerSchema);