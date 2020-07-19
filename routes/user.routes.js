const User = require("../models/user.model");
const router = require("express").Router();
const isLoggedIn = require("../lib/checkBlock");

//==================== index ====================//

router.get("/index", async (req, res) => {
    try {
        let users = await User.find();
        res.render("user/index", { users });
    }
    catch(err) {
        console.log(err);
    }
});

//==================== show (temporary) ====================//

router.get("/index/:id", async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        res.send(user);
    }
    catch(err) {
        console.log(err);
    }
});


module.exports = router;