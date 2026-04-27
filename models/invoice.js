
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
        senderName: { type: String, required: true },
        senderContact: { type: String, required: true },
        senderEmail: { type: String, required: true },
        recipientName: { type: String, required: true },
        recipientContact: { type: String, required: true },
        recipientEmail: { type: String, required: true },
    services: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    taxRate: { type: Number, required: true },
    discountRate: { type: Number, required: true },
    total: { type: Number, required: true }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
