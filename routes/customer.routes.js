const router = require("express").Router();
const Customer = require("../models/customer.model");

//==================== index ====================//

router.get("/index", async (req, res) => {
    try {
        let customers = await Customer.find();
        res.render("customer/index", {customers});
    }
    catch(err) {
        console.log(err);
    }
    
});

//==================== show (temp) ====================//

router.get("/show/:id", async (req, res) => {
    let customer = await Customer.findById(req.params.id);
    res.send(customer);
})

module.exports = router;