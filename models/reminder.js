const mongoose = require("mongoose");

//Schema set up
const reminderSchema = new mongoose.Schema({
    name: String,
    code: Number,
    phone: Number,
    email: String,
    address: String,
    type: String,
    price: String,
    time: Object,
    date: Object,
    tech: String,
    details: String,
    dateAdded: Object,
    chaseDate: Object,
    reminderDate: Object
});

module.exports = mongoose.model("Reminder", reminderSchema);