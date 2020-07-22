const router = require("express").Router();
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Customer = require("../models/customer.model");
const moment = require("moment");
const axios = require("axios");


//==================== index ====================//


router.get("/index", async (req, res) => {
    let ordersToday = await Order.find({
        expectedDelivery: {
            $gte: moment().startOf('day').toDate(),
            $lt: moment().endOf('day').toDate()
        }
    }).populate("customer", "-orders");

    let addresses = [];
    
    //for retrieving coordinates of addresses of orders
    for (let i = 0; i < ordersToday.length; i++) {
        let address = ordersToday[i].customer.address.replace(/\s/g, '+').toLowerCase()
        let coord = await axios.get(`https://developers.onemap.sg/commonapi/search?searchVal=${address}&returnGeom=Y&getAddrDetails=Y`)
        addresses.push( { lat: coord.data.results[0].LATITUDE, lng: coord.data.results[0].LONGITUDE } );
    }

    res.render("delivery/index", { ordersToday, addresses });
});


router.get("/show", async (req, res) => {

});


module.exports = router;