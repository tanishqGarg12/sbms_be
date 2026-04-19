const express = require('express');
const cartController = require('../controllers/cart');
const { isUser,auth } = require('../middlewares/auth'); // Assuming you have a middleware for authentication

const router = express.Router();

// Get Cart for the logged-in user
router.get('/',auth,isUser,cartController.getCart);

// Add Item to Cart
router.post('/add',auth,isUser, cartController.addItemToCart);

// Update Item Quantity in Cart
router.put('/update', isUser, cartController.updateCartItem);

// Remove Item from Cart
router.delete('/remove', auth, isUser, cartController.removeItemFromCart);

// Clear Cart
router.delete('/clear',auth,  isUser, cartController.clearCart);

module.exports = router;