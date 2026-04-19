// routes/categorySubcategoryRoutes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const subcategoryController = require('../controllers/subcategoryController');

// Category Routes
router.post('/categories', categoryController.createCategory); // Create a new category
router.get('/categories', categoryController.getAllCategories); // Get all categories
router.put('/categories/:id', categoryController.updateCategory); // Update a category
router.delete('/categories/:id', categoryController.deleteCategory); // Delete a category

// Subcategory Routes
router.post('/subcategories', subcategoryController.createSubcategory); // Create a new subcategory
router.get('/subcategories', subcategoryController.getAllSubcategories); // Get all subcategories
router.put('/subcategories/:id', subcategoryController.updateSubcategory); // Update a subcategory
router.delete('/subcategories/:id', subcategoryController.deleteSubcategory); // Delete a subcategory

module.exports = router;