const mongoose = require("mongoose");

//Schema set up
const archiveSchema = new mongoose.Schema({
    name: String,
    code: Number,
    phone: Number,
    address: String,
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

module.exports = mongoose.model("Archive", archiveSchema);