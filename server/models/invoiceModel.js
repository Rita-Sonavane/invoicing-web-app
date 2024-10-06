const mongoose = require('mongoose');

const InvoiceSchema = mongoose.Schema({
    dueDate: Date,
    currency: String,
    items: [ { itemName: String, unitPrice: String, quantity: String, discount: String, amount: String } ],
    rates: String,
    taxRate: Number,
    vat: Number,
    total: Number,
    subTotal: Number,
    notes: String,
    status: String,
    invoiceNumber: Number,
    type: String,
    creator: [String],
    totalAmountReceived: Number,
    client: { name: String, email: String, phone: String, address: String },
    paymentRecords: [ {amountPaid: Number, datePaid: Date, paymentMethod: String, note: String, paidBy: String } ],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const InvoiceModel = mongoose.model('InvoiceModel', InvoiceSchema)
module.exports = InvoiceModel;