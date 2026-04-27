// controllers/categoryController.js

const Category = require('../models/category');
const Subcategory = require('../models/subcategory');

// Create a new category
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  
  const newCategory = new Category({
    name,
    description,
    subcategories: [], // Initialize with an empty array
  });

  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('subcategories');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Remove all subcategories associated with this category
    await Subcategory.deleteMany({ categoryId: id });

    // Remove the category itself
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};