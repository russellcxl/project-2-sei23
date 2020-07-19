const mongoose = require("mongoose");

let CustomerSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String },
    postal: { 
        type: Number, 
        required: true, 
        validate: {
            validator: function(postal) {
                postal.length == 6 ? true : false
            },
            message: prop => `${prop.value} is not a valid postal code`
        }
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order" 
        }
    ]
});

//==================== export ====================//

module.exports = mongoose.model("Customer", CustomerSchema);