const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const moment = require("moment");
const Helpers = require("./methods/index");
const app = express();

//Assign port
const PORT = process.env.PORT || 3000;

//Require routes
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");

//Connect to database
mongoose.connect(`mongodb+srv://blackhawk:admin123@cluster0.ei3pt.mongodb.net/blackhawk-customer-db?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

//Configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use(methodOverride("_method"));

app.set("view engine", "ejs");

//Configuration
//Set routes
app.use(authRoutes);
app.use("/customers", customerRoutes);

//Execute function that will search database for cutomers due a chase
Helpers.j;

//Setup server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});


