// controllers/subcategoryController.js

const Subcategory = require('../models/subcategory');
const Category = require('../models/category');

const createSubcategory = async (req, res) => {
  const { name, description, categoryId } = req.body;
  
  const newSubcategory = new Subcategory({
    name,
    description,
    categoryId,
  });

  try {
    const savedSubcategory = await newSubcategory.save();
    console.log(savedSubcategory)
    
    // Optionally, you can also update the parent category to include this subcategory
    await Category.findByIdAndUpdate(categoryId, {
      $push: { subcategories: savedSubcategory._id },
    });

    res.status(201).json(savedSubcategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
};

// Get all subcategories
const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('categoryId');
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
};

// Update a subcategory
const updateSubcategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId } = req.body;

  try {
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      { name, description, categoryId },
      { new: true }
    );

    // Optionally, you can also update the parent category to include this subcategory
    await Category.findByIdAndUpdate(categoryId, {
      $addToSet: { subcategories: updatedSubcategory._id },
    });

    res.status(200).json(updatedSubcategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subcategory' });
  }
};

// Delete a subcategory
const deleteSubcategory = async (req, res) => {
  const { id } = req.params;

  try {
    const subcategory = await Subcategory.findByIdAndDelete(id);

    // Optionally, you can also update the parent category to remove this subcategory
    await Category.findByIdAndUpdate(subcategory.categoryId, {
      $pull: { subcategories: subcategory._id },
    });

    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subcategory' });
  }
};

module.exports = {
  createSubcategory,
  getAllSubcategories,
  updateSubcategory,
  deleteSubcategory,
};