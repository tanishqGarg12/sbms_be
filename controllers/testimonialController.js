// controllers/testimonialController.js
const Testimonial = require('../models/Testimonial');

// Get all testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new testimonial
const createTestimonial = async (req, res) => {
  const { name, text, img } = req.body;

  const newTestimonial = new Testimonial({
    name,
    text,
    img,
  });

  try {
    const savedTestimonial = await newTestimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
};