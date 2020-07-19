const router = require("express").Router();
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Customer = require("../models/customer.model");


//==================== new ====================//

router.get("/new", async (req, res) => {
    res.render("order/new");
});

router.post("/new", async (req, res) => {
    try {
        console.log(req.body);
        let { name, orders, phone, address, postal, expectedDelivery } = req.body;

        let customer = await new Customer({
            name: name,
            phone: phone,
            address: address,
            postal: postal
        }).save();

        let order = await new Order({
            orders: orders,
            customer: customer._id,
            expectedDelivery: expectedDelivery
        }).save();

        customer.orders.push(order._id);

        res.redirect("/order/index");

    }
    catch(err) {
        console.log(err);
    }
    
});

//==================== index ====================//

router.get("/index", async (req, res) => {
    try {
        let orders = await Order.find();
        res.render("order/index", {orders});
    }
    catch(err) {
        console.log(err);
    }
});

router.get("/index/:id", async (req, res) => {
    try {
        let order = await Order.findById(req.params.id).populate("customer");
        res.send(order);
    }
    catch(err) {
        console.log(err);
    }
});


module.exports = router;