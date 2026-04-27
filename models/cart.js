const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory', // Assuming you have an Inventory model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  items: [cartItemSchema],
  totalQuantity: {
    type: Number,
    // required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    // required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre('save', function(next) {
  this.totalQuantity = this.items.reduce((acc, item) => acc + item.quantity, 0);
  this.totalPrice = this.items.reduce((acc, item) => acc + item.total, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
