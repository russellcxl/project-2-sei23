const router = require("express").Router();
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Customer = require("../models/customer.model");
const moment = require("moment");


//==================== new ====================//

router.get("/new", async (req, res) => {
    try {
        res.render("order/new");
    }
    catch(err) {
        console.log(err);
    }
    
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
        let orders = await Order.find().populate("customer");

        //unfulfilled orders; $match is the same as Model.find
        let unfulfilled = await Order.aggregate([
            { $match: { status: { $eq: "unfulfilled" } } }
        ]);

        //deliveries today
        //toDate() converts date into JS format
        let deliveriesToday = await Order.find({
            expectedDelivery: {
                $gte: moment().startOf('day').toDate(),
                $lt: moment().endOf('day').toDate()
            }
        });
        
        //orders made today
        let ordersToday = await Order.find({
            createdAt: {
                $gte: moment().startOf('day').toDate(),
                $lt: moment().endOf('day').toDate()
            }
        });

        //most popular product
        let mostPopular = await Order.aggregate([
            { $unwind: "$orders" },
            { $group: 
                {
                    _id: "$orders.product",
                    count: { $sum: "$orders.quantity" }
                }
            },
            { $sort:
                {
                    count: -1
                } 
            }
        
        ]);

        res.render("order/index", { orders, unfulfilled, deliveriesToday, ordersToday, mostPopular });
    }
    catch(err) {
        console.log(err);
    }
});

router.get("/index/:id", async (req, res) => {
    try {
        let order = await Order.findById(req.params.id).populate("customer", "-orders");
        res.send(order);
    }
    catch(err) {
        console.log(err);
    }
});

//==================== export ====================//

module.exports = router;