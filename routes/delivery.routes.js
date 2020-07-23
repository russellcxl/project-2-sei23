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
        },
        status: {
            $in: [ "unfulfilled", "partially fulfilled" ]
        }
    }).populate("customer", "-orders");

    let addresses = [];
    
    //for retrieving coordinates of addresses of orders
    //onemap has a limit of 250 calls/min, so app may hang if limit is exceeded
    //any way to tell the user to wait?
    for (let i = 0; i < ordersToday.length; i++) {
        let address = ordersToday[i].customer.address.replace(/\s/g, '+').toLowerCase()
        let coord = await axios.get(`https://developers.onemap.sg/commonapi/search?searchVal=${address}&returnGeom=Y&getAddrDetails=Y`)
        addresses.push({ 
            lat: coord.data.results[0].LATITUDE, 
            lng: coord.data.results[0].LONGITUDE, 
            text: `${ordersToday[i].customer.name}` 
        });
    }
    
    res.render("delivery/index", { ordersToday, addresses });
});



module.exports = router;