const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    purchasedprice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    file: {
        type: String, // This will store the image file path
        // required: true // Make it required if every inventory item must have an image
    }
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
