const express = require("express");

const app = express();

//Assign port
const PORT = process.env.PORT || 3000;

//Require routes
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");

app.use(express.static("public"));

app.set("view engine", "ejs");

//Configuration
//Set routes
app.use(authRoutes);
app.use("/customers", customerRoutes);

//Setup server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});