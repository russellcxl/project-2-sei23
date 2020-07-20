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
        enum: ["unfulfilled", "partially fulfilled", "fulfilled"],
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


OrderSchema.methods.shortenDate = function () {
    return moment(this.expectedDelivery).format("MMMM Do YYYY");
};

//==================== export ====================//

module.exports = mongoose.model("Order", OrderSchema);