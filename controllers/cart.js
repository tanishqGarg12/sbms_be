const Cart = require('../models/cart');
const Inventory = require('../models/inventory');
const mongoose = require('mongoose');


exports.getCart = async (req, res) => {
  try {
    // console.log("user is "+req.user.user);
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.addItemToCart = async (req, res) => {
  const { productId,quantity,id} = req.body;
//   console.log(productId)

  try {
    // console.log("user isssss "+user.user)
    const product = await Inventory.findById(productId);
    // console.log(product)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log("user id is "+ id)
    // cosnole.log("heloo")
    let cart = await Cart.findOne({ userId: id});
    // console.log(cart)

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        let item = cart.items[itemIndex];
        item.quantity += quantity;
        item.total = item.quantity * product.price;
        cart.items[itemIndex] = item;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          quantity:quantity,
          price: product.price,
          total: product.price * quantity,
        });
      }
    } else {
      cart = new Cart({
        userId: id,
        items: [{
          productId,
          name: product.name,
          quantity,
          price: product.price,
          total: product.price * quantity,
        }],
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].total = quantity * cart.items[itemIndex].price;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// const mongoose = require('mongoose');
// const mongoose = require('mongoose');

exports.removeItemFromCart = async (req, res) => {
  const { id } = req.body; // This is the product ID you want to remove

  try {
    console.log("User ID: " + req.user.id); // For debugging
    console.log("Product ID to remove: " + id);

    // Convert the product id from the request body to ObjectId
    const objectIdToRemove = new mongoose.Types.ObjectId(id);
    console.log("main id: " + objectIdToRemove);

    // Find the cart by userId and remove the item with the matching productId using $pull
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.user.id }, // Match by userId
      { $pull: { items: { _id: objectIdToRemove } } }, // Pull item from items array
      { new: true } // Return the updated document
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the cart has any remaining items
    if (updatedCart.items.length === 0) {
      // If no items are left, set quantity and amount to 0
      updatedCart.quantity = 0;
      updatedCart.amount = 0;
    } else {
      // Otherwise, recalculate the total quantity and amount
      let newQuantity = 0;
      let newAmount = 0;

      updatedCart.items.forEach(item => {
        newQuantity += item.quantity;
        newAmount += item.total;
      });

      updatedCart.quantity = newQuantity;
      updatedCart.amount = newAmount;
    }

    // Save the updated cart with new quantity and amount
    await updatedCart.save();

    console.log("Updated Cart after deletion:", updatedCart);

    // Return the updated cart
    return res.status(200).json(updatedCart);
  } catch (error) {
    // Handle server errors
    return res.status(500).json({ message: 'Server Error', error });
  }
};



exports.clearCart = async (req, res) => {
  try {
    console.log("in the clearance");
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Update inventory for each item in cart
    for (const cartItem of cart.items) {
      const inventory = await Inventory.findById(cartItem.productId);
      
      if (inventory) {
        inventory.quantity -= cartItem.quantity;
        // Ensure quantity doesn't go negative
        inventory.quantity = Math.max(0, inventory.quantity);
        await inventory.save();
      }
    }

    // Clear cart
    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};