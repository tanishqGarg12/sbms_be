// const nodemailer = require('nodemailer');
// const pdf = require('html-pdf');
// const path = require('path');
// const fs = require('fs');
// const Invoice = require('../models/Invoice');
// const { v4: uuidv4 } = require('uuid');

// // Calculate total cost
// const calculateTotal = (services, taxRate, discountRate) => {
//     const subtotal = services.reduce((acc, service) => acc + service.quantity * service.price, 0);
//     const tax = subtotal * taxRate;
//     const discount = subtotal * discountRate;
//     return subtotal + tax - discount;
// };

// // Create a new invoice
// exports.createInvoice = async (req, res) => {
//     try {
//         const { senderName, senderContact, senderEmail, recipientName, recipientContact, recipientEmail, services, taxRate, discountRate } = req.body;

//         // Validate required fields
//         if (!senderName || !senderContact || !recipientName || !recipientContact || !senderEmail || !recipientEmail) {
//             return res.status(400).json({ message: 'Required fields are missing' });
//         }

//         const total = calculateTotal(services, taxRate, discountRate);
//         const senderId = uuidv4(); // Generate a new senderId

//         const newInvoice = new Invoice({ senderId, senderName, senderContact, senderEmail, recipientName, recipientContact, recipientEmail, services, taxRate, discountRate, total });
//         const savedInvoice = await newInvoice.save();

//         // Generate PDF
//         const pdfPath = path.join(__dirname, '../tmp', `invoice_${savedInvoice._id}.pdf`);
//         const html = `
//             <h1>Invoice</h1>
//             <p><strong>Sender:</strong> ${senderName} <br/> ${senderContact} <br/> ${senderEmail}</p>
//             <p><strong>Recipient:</strong> ${recipientName} <br/> ${recipientContact} <br/> ${recipientEmail}</p>
//             <h2>Services</h2>
//             <table border="1" style="width:100%; border-collapse:collapse;">
//                 <thead>
//                     <tr>
//                         <th>Service Name</th>
//                         <th>Quantity</th>
//                         <th>Price</th>
//                         <th>Amount</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${services.map(service => `
//                         <tr>
//                             <td>${service.name}</td>
//                             <td>${service.quantity}</td>
//                             <td>${service.price.toFixed(2)}</td>
//                             <td>${(service.quantity * service.price).toFixed(2)}</td>
//                         </tr>
//                     `).join('')}
//                 </tbody>
//             </table>
//             <p>Subtotal: ${services.reduce((acc, service) => acc + service.quantity * service.price, 0).toFixed(2)}</p>
//             <p>Tax: ${total.toFixed(2)}</p>
//             <p>Discount: ${total * discountRate.toFixed(2)}</p>
//             <p>Total: ${total.toFixed(2)}</p>
//         `;
        
//         pdf.create(html).toFile(pdfPath, async (err, pdfRes) => {
//             if (err) {
//                 console.error('Error generating PDF:', err);
//                 return res.status(500).json({ message: 'Failed to generate PDF' });
//             }

//             // Send email with PDF attachment
//             const transporter = nodemailer.createTransport({
//                 service: 'Gmail', // Use your email service
//                 auth: {
//                     user: 'arushigupta7492@gmail.com', // Your email
//                     pass: 'kkosaswvnwwvdpnk', // Your email password
//                 },
//             });

//             const mailOptions = {
//                 from: 'arushigupta7492@gmail.com',
//                 to: recipientEmail, // Send to recipient email
//                 subject: 'Invoice PDF',
//                 text: 'Please find the attached invoice.',
//                 attachments: [
//                     {
//                         filename: `invoice_${savedInvoice._id}.pdf`,
//                         path: pdfPath,
//                     },
//                 ],
//             };

//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.error('Error sending email:', error);
//                     return res.status(500).json({ message: 'Failed to send email' });
//                 }

//                 // Cleanup
//                 fs.unlinkSync(pdfPath);

//                 res.status(201).json(savedInvoice);
//             });
//         });
//     } catch (error) {
//         console.error('Error saving invoice:', error);
//         res.status(500).json({ message: 'Failed to save invoice', error: error.message });
//     }
// };

// // Get all invoices
// exports.getAllInvoices = async (req, res) => {
//     try {
//         const invoices = await Invoice.find();
//         res.status(200).json(invoices);
//     } catch (error) {
//         console.error('Error fetching invoices:', error);
//         res.status(500).json({ message: 'Failed to fetch invoices' });
//     }
// };
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const Invoice = require('../models/invoice');
const { v4: uuidv4 } = require('uuid');

// Calculate total cost
const calculateTotal = (services, taxRate, discountRate) => {
    const subtotal = services.reduce((acc, service) => acc + service.quantity * service.price, 0);
    const tax = subtotal * taxRate;
    const discount = subtotal * discountRate;
    return subtotal + tax - discount;
};

// Create a new invoice
exports.createInvoice = async (req, res) => {
    try {
        const { senderName, senderContact, senderEmail, recipientName, recipientContact, recipientEmail, services, taxRate, discountRate } = req.body;

        // Validate required fields
        if (!senderName || !senderContact || !recipientName || !recipientContact || !senderEmail || !recipientEmail) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        const total = calculateTotal(services, taxRate, discountRate);
        const senderId = uuidv4(); // Generate a new senderId

        const newInvoice = new Invoice({
            senderId,
            senderName,
            senderContact,
            senderEmail,
            recipientName,
            recipientContact,
            recipientEmail,
            services,
            taxRate,
            discountRate,
            total
        });

        const savedInvoice = await newInvoice.save();
        console.log('Invoice saved successfully:', savedInvoice);

        // Generate PDF
        const pdfPath = path.join(__dirname, '../tmp', `invoice_${savedInvoice._id}.pdf`);
        const html = `
            <h1>Invoice</h1>
            <p><strong>Sender:</strong> ${senderName} <br/> ${senderContact} <br/> ${senderEmail}</p>
            <p><strong>Recipient:</strong> ${recipientName} <br/> ${recipientContact} <br/> ${recipientEmail}</p>
            <h2>Services</h2>
            <table border="1" style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr>
                        <th>Service Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${services.map(service => `
                        <tr>
                            <td>${service.name}</td>
                            <td>${service.quantity}</td>
                            <td>${service.price.toFixed(2)}</td>
                            <td>${(service.quantity * service.price).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p>Subtotal: ${services.reduce((acc, service) => acc + service.quantity * service.price, 0).toFixed(2)}</p>
            <p>Tax: ${(services.reduce((acc, service) => acc + service.quantity * service.price, 0) * taxRate).toFixed(2)}</p>
            <p>Discount: ${(services.reduce((acc, service) => acc + service.quantity * service.price, 0) * discountRate).toFixed(2)}</p>
            <p>Total: ${total.toFixed(2)}</p>
        `;

        pdf.create(html).toFile(pdfPath, async (err, pdfRes) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return res.status(500).json({ message: 'Failed to generate PDF', error: err.message });
            }

            console.log('PDF generated successfully:', pdfRes);

            // Send email with PDF attachment
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'arushigupta7492@gmail.com',
                    pass: 'kkosaswvnwwvdpnk',
                },
            });

            const mailOptions = {
                from:'arushigupta7492@gmail.com',
                to: recipientEmail,
                subject: 'Invoice PDF',
                text: 'Please find the attached invoice.',
                attachments: [
                    {
                        filename: `invoice_${savedInvoice._id}.pdf`,
                        path: pdfPath,
                    },
                ],
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Failed to send email', error: error.message });
                }

                console.log('Email sent successfully:', info);

                // Cleanup
                fs.unlink(pdfPath, (err) => {
                    if (err) {
                        console.error('Error deleting PDF:', err);
                    } else {
                        console.log('PDF deleted successfully');
                    }
                });

                res.status(201).json(savedInvoice);
            });
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Failed to process request', error: error.message });
    }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Failed to fetch invoices', error: error.message });
    }
};
