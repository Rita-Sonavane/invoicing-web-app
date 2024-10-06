const express = require('express');
const { sendInvoiceEmail, nextInvoiceNumber, getInvoicesByUser, getTotalCount, getInvoices, createInvoice, getInvoice, updateInvoice, deleteInvoice, getInvoiceStatusCounts, getInvoiceInternal, generatePDF } = require('../controllers/invoices.js');

const router = express.Router()

router.get('/status-count', getInvoiceStatusCounts)
router.get('/count', getTotalCount)
router.get('/', getInvoices);
router.get('/get/:id', getInvoice)
router.get('/user', getInvoicesByUser)
router.post('/add', createInvoice)
router.put('/update/:id', updateInvoice)
router.delete('/delete/:id', deleteInvoice)
router.get('/next-invoice-number', nextInvoiceNumber)
router.post('/generate-pdf/:id', generatePDF)
router.post('/send-invoice-email/:id', sendInvoiceEmail);
module.exports = router;