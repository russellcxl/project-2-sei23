const router = require("express").Router();
const passport = require("passport");
const isLoggedIn = require("../lib/checkBlock");
const User = require("../models/user.model");

//==================== register ====================//

router.get("/register", (req, res) => {
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
        console.log(err);
    }
});

//==================== login ====================//







module.exports = router;