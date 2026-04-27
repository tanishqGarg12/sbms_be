// models/subcategory.js

const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true,
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

// Middleware to update the updatedAt field
subcategorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
