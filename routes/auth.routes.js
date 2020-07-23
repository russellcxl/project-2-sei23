const router = require("express").Router();
const passport = require("../lib/passportConfig");
const isLoggedIn = require("../lib/checkBlock");
const User = require("../models/user.model");

//==================== register ====================//

router.get("/register", isLoggedIn, (req, res) => {
    res.render("auth/register");
});


router.post("/register", async (req, res) => {
    try {
        let user = await new User(req.body);
        req.body.role === "admin" ? user.isAdmin = true : user.isStaff = true;
        await user.save();
        res.redirect("/user/index");
    }
    catch(err) {
        console.log(err.errors["email"].message);//mongoose model error
    }
});

//==================== login ====================//

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post("/login",
    passport.authenticate("local", {
        successRedirect: "/order/index",
        failureRedirect: "/auth/login",
        failureFlash: "Invalid Username or Password",
        successFlash: "You have logged In!"
    })
);

module.exports = router;