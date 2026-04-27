const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Product schema
const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock_quantity: { type: Number },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
