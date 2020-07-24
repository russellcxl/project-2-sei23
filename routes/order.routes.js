const router = require("express").Router();
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Customer = require("../models/customer.model");
const moment = require("moment");
const isLoggedin = require("../lib/checkBlock");


//==================== new ====================//


router.get("/new", isLoggedin, async (req, res) => {
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

        await Customer.findByIdAndUpdate(customer._id, 
                {
                    $push: {orders: order._id}
                }
            );
        
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

        //overdue orders
        let overdue = await Order.find({
            expectedDelivery: {
                $lt: moment().startOf('day').toDate()
            },
            status: {
                $in: [ "unfulfilled", "partially fulfilled" ]
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

        res.render("order/index", { orders, unfulfilled, deliveriesToday, ordersToday, mostPopular, overdue });
    }
    catch(err) {
        console.log(err);
    }
});

//==================== fulfill ====================//


router.post("/fulfill/:id", isLoggedin, async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, {status: "fulfilled"});
        res.redirect("/delivery/index");
    }
    catch(err) {
        console.log(err);
    }
});


//==================== edit/delete ====================//


router.get("/edit/:id", isLoggedin, async (req, res) => {
    try {
        let order = await Order.findById(req.params.id).populate("customer", "-orders");
        res.render("order/edit", {order});
    }
    catch(err) {
        console.log(err);
    }
});


router.post("/edit/:id", async (req, res) => {
    try {

        let { name, orders, phone, address, postal, expectedDelivery, status } = req.body;

        await Order.findByIdAndUpdate(req.params.id, 
                {
                    orders: orders,
                    expectedDelivery: expectedDelivery,
                    status: status
                }
            );

        let order = await Order.findById(req.params.id);
        let customerId = order.customer;

        await Customer.findByIdAndUpdate(customerId, 
                {
                    name: name,
                    phone: phone,
                    address: address,
                    postal: postal
                }
            );

        res.redirect("/order/index");
    }
    catch(err) {
        console.log(err);
    }
});


router.delete("/delete/:id", async (req, res) => {
    try {
        //removes order from customer
        await Customer.update(
            {},
            { $pull: { orders: req.params.id } },
            { multi: true }
        );

        //removes order
        await Order.remove( { _id: { $eq: req.params.id } } );
        
        res.redirect("/order/index");
    }
    catch(err) {
        console.log(err);
    }
});


//==================== export ====================//

module.exports = router;