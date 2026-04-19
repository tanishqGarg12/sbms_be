const express = require('express');
const { getTestimonials, createTestimonial } = require('../controllers/testimonialController');

const router = express.Router();

// Routes for testimonials
router.get('/', getTestimonials);
router.post('/', createTestimonial);

module.exports = router;