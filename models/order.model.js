const mongoose = require("mongoose");
const moment = require("moment");

let OrderSchema = new mongoose.Schema({

    orders: [{
        product: { type: String, required: true },
        quantity: { type: Number, min: 1 }
    }],

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    expectedDelivery: Date,

    status: { 
        type: String,
        enum: ["unfulfilled", "partially fulfilled", "done"],
        default: "unfulfilled"
    },

    comments: [
        { 
            content: String, 
            postedBy: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ]

}, { timestamps: true });


OrderSchema.methods.shortenDate = function() {
    return moment(this.expectedDelivery).format("MMMM Do YYYY, ddd");
};

//for populating the date input when editing orders
OrderSchema.methods.displayDate = function() {
    return moment(this.expectedDelivery).format("YYYY-MM-DD");
};

//==================== export ====================//

module.exports = mongoose.model("Order", OrderSchema);