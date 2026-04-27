const mongoose = require('mongoose');
const inventory = require("../models/inventory");
module.exports.createInventory = async (req, res) => {
    try {
        console.log("Received Request");

        // Log the uploaded file for debugging
        if (req.file) {
            console.log("Uploaded File:", req.file);
        } else {
            console.log("No file uploaded");
        }

        const { name, category, quantity, unit, purchasedprice, price, subcategory } = req.body;

        // Handle file path
        const file = req.file ? `/uploads/${req.file.filename}` : null; // Use relative path for the file

        // Validate required fields
        if (!name || !category || !unit || !price) {
            return res.status(400).json({ message: 'Fill all required details.' });
        }

        // Validate non-negative values
        if (quantity < 0 || price < 0) {
            return res.status(400).json({ message: 'Quantity and price must be non-negative.' });
        }

        // Create new inventory item
        const newInventoryItem = new inventory({
            name,
            category,
            subcategory,
            quantity,
            unit,
            purchasedprice,
            price,
            file // Store the relative image path
        });

        // Save the item to the database
        const savedItem = await newInventoryItem.save();

        // Respond with the saved item and a success message
        res.status(201).json({
            _id: savedItem._id,
            name: savedItem.name,
            category: savedItem.category,
            subcategory: savedItem.subcategory,
            purchasedprice: savedItem.purchasedprice,
            quantity: savedItem.quantity,
            unit: savedItem.unit,
            price: savedItem.price,
            file: savedItem.file,
            message: "Item created successfully",
        });
    } catch (error) {
        // Handle server errors
        console.error("[ERROR] Failed to create inventory item:", error.message);
        res.status(500).json({ message: error.message });
    }
};


// Update inventory item
// const inventory = require('../models/inventory');

module.exports.updateInventory = async (req, res) => {
    console.log("Edfcdsdcfddc")
    const { name, category, description, purchasedprice,quantity, unit, price, supplierName } = req.body;
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid inventory ID' });
    }

    try {
        const inventoryItem = await inventory.findById(id);
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        // Update the inventory item
        const updatedItem = await inventory.findByIdAndUpdate(
            id,
            {
                name: name || inventoryItem.name,
                category: category || inventoryItem.category,
                description: description || inventoryItem.description,
                quantity: quantity !== undefined ? quantity : inventoryItem.quantity,
                unit: unit || inventoryItem.unit,
                purchasedprice:purchasedprice,
                price: price !== undefined ? price : inventoryItem.price,
                supplierName: supplierName || inventoryItem.supplierName,
            },
            { new: true }
        );

        // Check if the update was successful
        if (!updatedItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete inventory item
module.exports.deleteInventory = async (req, res) => {
    try {
        // Ensure req.params.id is a valid ObjectId
        const id = req.params.id;
        console.log(id)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Find and delete the inventory item by ObjectId
        const deletedItem = await inventory.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// Get all inventory items
module.exports.getAllInventory = async (req, res) => {
    try {
        const inventoryItems = await inventory.find();
        res.status(200).json(inventoryItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports.getAllInventoryc = async (req, res) => {
    try {
        // MongoDB aggregation to group by category and subcategory
        const groupedInventory = await inventory.aggregate([
            {
                $group: {
                    _id: { category: "$category", subcategory: "$subcategory" }, // Group by category and subcategory
                    totalQuantity: { $sum: "$quantity" }, // Sum of quantity for each group
                    items: {
                        $push: {
                            name: "$name",
                            quantity: "$quantity",
                            purchasedPrice: "$purchasedprice",
                            sellingPrice: "$price",
                            addedTime: "$createdAt",
                            updatedTime: "$updatedAt",
                        }
                    }
                }
            },
            {
                $sort: { "_id.category": 1, "_id.subcategory": 1 } // Sort the results by category and subcategory
            }
        ]);

        // Send grouped inventory data as response
        res.status(200).json(groupedInventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// app.post("/editcategory",async function(req,res){
//     const categoryobj =db.coolection("category");
//     const 
// })


// Get inventory item by ID
module.exports.getInventoryById = async (req, res) => {
    try {
        const inventoryItem = await inventory.findById(req.params.id);
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(inventoryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Restock inventory item
module.exports.restockInventory = async (req, res) => {
    const { quantity } = req.body;
    try {
        const inventoryItem = await inventory.findById(req.params.id);
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        inventoryItem.quantity += quantity;
        const updatedItem = await inventoryItem.save();

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports.getLowStockItems = async (req, res) => {
    try {
        // Fetch all inventory items
        const inventoryItems = await inventory.find();

        // Filter items with quantity less than 5
        const lowStockItems = inventoryItems.filter(item => item.quantity <10);

        // Respond with low-stock items
        res.status(200).json(lowStockItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.search = async (req, res) => {
    try {
        const searchQuery = req.query.query || ''; // Get the search query from query parameters

        // If searchQuery is empty, fetch all inventory items
        const query = searchQuery 
            ? { name: { $regex: searchQuery, $options: 'i' } }
            : {};

        // MongoDB query to find matching inventory items
        const searchResults = await inventory.find(query);

        // Return search results
        res.status(200).json({
            success: true,
            results: searchResults,
        });
    } catch (err) {
        console.error('Error searching inventory:', err);
        res.status(500).json({
            success: false,
            message: 'Error searching inventory',
        });
    }
};

// Get total stock for each category
module.exports.getCategoryWiseStock = async (req, res) => {
    try {
        // Use MongoDB aggregation to group by category and sum the quantities
        const categoryWiseStock = await inventory.aggregate([
            {
                $group: {
                    _id: "$category", // Group by category
                    totalStock: { $sum: "$quantity" } // Sum the quantities in each category
                }
            },
            {
                $project: {
                    category: "$_id", // Rename _id to category
                    totalStock: 1,
                    _id: 0 // Exclude the default _id field
                }
            }
        ]);

        // Respond with the aggregated data
        res.status(200).json({
            success: true,
            data: categoryWiseStock
        });
    } catch (error) {
        console.error('Error getting category-wise stock:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting category-wise stock'
        });
    }
};
// http://localhost:4000/api/v1/inventory/getpurchasedprice
// http://localhost:4000/api/v1/inventory/gettotal
// http://localhost:4000/api/v1/inventory/getnewitems
// http://localhost:4000/api/v1/inventory/getmonthwise
// Get total purchased value for each category
module.exports.getCategoryWisePurchasedValue = async (req, res) => {
    try {
        // Use MongoDB aggregation to group by category and sum the purchased values
        const categoryWisePurchasedValue = await inventory.aggregate([
            {
                $match: {
                    purchasedprice: { $gt: 0 } // Match only items with a purchased price greater than 0
                }
            },
            {
                $group: {
                    _id: "$category", // Group by category
                    totalPurchasedValue: { $sum: { $multiply: ["$quantity", "$purchasedprice"] } } // Sum the total value of purchased items
                }
            },
            {
                $project: {
                    category: "$_id", // Rename _id to category
                    totalPurchasedValue: 1,
                    _id: 0 // Exclude the default _id field
                }
            }
        ]);

        // Respond with the aggregated data
        res.status(200).json({
            success: true,
            data: categoryWisePurchasedValue
        });
    } catch (error) {
        console.error('Error getting category-wise purchased value:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting category-wise purchased value'
        });
    }
};

// Get new inventory items added in the last two days
module.exports.getNewItemsLastTwoDays = async (req, res) => {
    try {
        console.log("testing the get new items")
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Calculate date for two days ago
        
        // Fetch items added in the last two days
        const newItems = await inventory.find({
            createdAt: { $gte: twoDaysAgo } // Filter for items created at or after the calculated date
        });
        const z=newItems.length

        // Respond with the new items
        res.status(200).json({
            success: true,
            data: z
        });
    } catch (error) {
        console.error('Error fetching new items:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching new items'
        });
    }
};

// Get total purchase price month-wise
module.exports.getMonthlyPurchasePrice = async (req, res) => {
    try {
        const result = await inventory.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" }, // Extract the year
                        month: { $month: "$createdAt" } // Extract the month
                    },
                    totalPurchasedPrice: { $sum: { $multiply: ["$quantity", "$purchasedprice"] } } // Calculate total purchased price
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
        ]);

        const length = result.length;

        // Respond with the result and the length
        res.status(200).json({
            success: true,
            data: result,
            length: length
        });
    } catch (error) {
        console.error('Error fetching monthly purchase price:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching monthly purchase price'
        });
    }
};

