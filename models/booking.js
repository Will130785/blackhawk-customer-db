const mongoose = require("mongoose");

//Schema set up
const bookingSchema = new mongoose.Schema({
    name: String,
    code: Number,
    phone: Number,
    address: String,
    post: String,
    type: String,
    price: String,
    time: Object,
    date: Object,
    tech: String,
    color: String,
    email: String,
    details: String,
    dateAdded: Object,
    chaseDate: Object,
    reminderDate: Object
});

module.exports = mongoose.model("Booking", bookingSchema);