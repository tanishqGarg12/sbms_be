const express = require('express');
const router = express.Router();
const { createInvoice, getAllInvoices,getInvoices, getInvoiceById, updateInvoice, deleteInvoice } = require('../controllers/invoice');
const { auth,isUser  } = require('../middlewares/auth');

// Route for creating a new invoice
router.post('/create', auth, isUser,createInvoice);

// Route for fetching all invoices for the logged-in user
router.get('/all', auth,isUser,getAllInvoices );

// Route for fetching a single invoice by ID
// router.get('/:id', auth,isUser , getInvoiceById);

// // Route for updating an existing invoice
// router.put('/:id', auth,isUser , updateInvoice);

// // Route for deleting an invoice
// router.delete('/:id', auth,isUser , deleteInvoice);

// Export the router for use in the main application
module.exports = router;