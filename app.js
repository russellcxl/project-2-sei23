const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressEjsLayouts = require("express-ejs-layouts");

require("dotenv").config();

//authentication
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const router = require("./routes/auth.routes");

//connect mongoDB
mongoose.connect(
    process.env.MONGODB,
    {
       useCreateIndex: true,
       useNewUrlParser: true,
       useUnifiedTopology: true 
    },
    () => console.log("MongoDB connected for Haste")
);

//==================== middleware ====================//

app.use(express.static("public"));
app.use(express.urlencoded( {extended: true} ));
app.set("view engine", "ejs");
app.use(expressEjsLayouts);

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

//==================== routes ====================//

app.get("/", (req, res) => {
    res.render("test");
});

//==================== port listen ====================//

app.listen(process.env.PORT, function() {
    console.log(`Haste running at localhost:${process.env.PORT}`);
})