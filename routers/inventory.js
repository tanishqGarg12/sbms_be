const express = require('express');
const {
    createInventory,
    updateInventory,
    deleteInventory,
    getAllInventory,
    getInventoryById,
    restockInventory,
    getLowStockItems,
    search,
    getCategoryWisePurchasedValue,
    getCategoryWiseStock,
    getNewItemsLastTwoDays,
    getMonthlyPurchasePrice,
    getAllInventoryc,
} = require('../controllers/Inventory');

const upload = require('../middlewares/multer'); // Import multer middleware

const router = express.Router();

// Routes

// Create new inventory item (with image upload)
router.post('/createinventory', upload.single('file'), createInventory);

// Update inventory item by ID (with optional image upload)
router.put('/inventory/:id', updateInventory);

// Delete inventory item by ID
router.delete('/inventory/:id', deleteInventory);

// Get all inventory items
router.get('/getallinventory', getAllInventory);
router.get('/getallinventoryc', getAllInventoryc);

// Get total stock details
router.get('/gettotal', getCategoryWiseStock);

// Get monthly purchase price summary
router.get('/getmonthwise', getMonthlyPurchasePrice);

// Get new items added in the last two days
router.get('/getnewitems', getNewItemsLastTwoDays);

// Get category-wise purchased price summary
router.get('/getpurchasedprice', getCategoryWisePurchasedValue);

// Get low-stock inventory items
router.get('/getlowinventory', getLowStockItems);

// Get inventory item by ID
router.get('/getinventory/:id', getInventoryById);

// Search inventory items
router.get('/search', search);


// Restock inventory item by ID
router.patch('/restockinventory/:id/restock', restockInventory);

module.exports = router;