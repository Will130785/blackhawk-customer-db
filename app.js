const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const moment = require("moment");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const Helpers = require("./methods/index");
const User = require("./models/user");
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

//Passport configuration
app.use(require("express-session")({
    secret: "This is a database app",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Make current user available to all pages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next();
});

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


