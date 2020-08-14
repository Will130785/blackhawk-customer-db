const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Helpers = require("./methods/index");
const User = require("./models/user");
const app = express();

//Assign port
const PORT = process.env.PORT || 3000;

//Require routes
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");

//Connect to database
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
//Configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Set static file location
app.use(express.static(__dirname + "/public"));
//Configure method-overrride
app.use(methodOverride("_method"));
//Set up flash
app.use(flash());
//Set view engine
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Configuration
//Set routes
app.use(authRoutes);
app.use("/customers", customerRoutes);

//Execute function that will search database for cutomers due a chase
// Helpers.j;

var cron = require('node-cron');
 
cron.schedule('30 * * * *', () => {
    Helpers.sendReminder();
});

//Setup server
app.listen(PORT, process.env.IP, () => {
    console.log(`Server running on port: ${PORT}`)
});


