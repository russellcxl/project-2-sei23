const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressEjsLayouts = require("express-ejs-layouts");
// const methodOverride = require("method-override");

require("dotenv").config();

//authentication
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const router = require("./routes/auth.routes");

//connect mongoDB server
mongoose.connect(
    process.env.MONGOLIVE,
    {
       useCreateIndex: true,
       useNewUrlParser: true,
       useUnifiedTopology: true 
    },
    () => console.log("MongoDB connected live for Haste")
);

//==================== middleware ====================//

app.use(express.static("public"));
app.use(express.urlencoded( {extended: true} ));
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
// app.use(methodOverride('_method'));

//express sessions
app.use(
    session ({
        secret: process.env.SECRET,
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 360000 }
    })
);

//passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(request, response, next) {
    response.locals.alerts = request.flash();
    response.locals.currentUser = request.user;
    next();
});

//routers
app.use("/user", require("./routes/user.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/order", require("./routes/order.routes"));
app.use("/customer", require("./routes/customer.routes"));

//==================== routes ====================//

app.get("/", (req, res) => {
    res.send("hello heroku");
    // res.redirect("/order/index");
});

//==================== port listen ====================//

app.listen(process.env.PORT, function() {
    console.log(`HASTE running at localhost:${process.env.PORT}`);
})