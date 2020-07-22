const router = require("express").Router();
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Customer = require("../models/customer.model");
const moment = require("moment");
const { route } = require("./order.routes");

//==================== index ====================//

router.get("/index", async (req, res) => {
    let ordersToday = await Order.find({
        expectedDelivery: {
            $gte: moment().startOf('day').toDate(),
            $lt: moment().endOf('day').toDate()
        }
    }).populate("customer", "-orders");
    //res.send(ordersToday)
    res.render("delivery/index", { ordersToday });
});




module.exports = router;