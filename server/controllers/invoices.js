const express = require('express')
const mongoose = require('mongoose')
const InvoiceModel = require('../models/invoiceModel.js');
const ProfileModel = require('../models/ProfileModel.js');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config()


const getInvoicesByUser = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const invoices = await InvoiceModel.find({ creator: searchQuery });

    res.status(200).json({ data: invoices });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


const getTotalCount = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const totalCount = await InvoiceModel.countDocuments();
    res.status(200).json(totalCount);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const getInvoiceStatusCounts = async (req, res) => {
  try {

    const paidCount = await InvoiceModel.countDocuments({ status: 'Paid' });
    const unpaidCount = await InvoiceModel.countDocuments({ status: 'Unpaid' });

    res.status(200).json({
      paidCount,
      unpaidCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoices = async (req, res) => {

  try {
    const allInvoices = await InvoiceModel.find({}).sort({ _id: -1 })

    res.status(200).json(allInvoices)

  } catch (error) {
    res.status(409).json(error.message)

  }

}


const nextInvoiceNumber = async (req, res) => {

  const invoice = req.body

  try {
    const lastInvoice = await InvoiceModel.findOne().sort({ invoiceNumber: -1 });
    const nextInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
    res.json({ nextInvoiceNumber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}


const createInvoice = async (req, res) => {

  const invoice = req.body

  const newInvoice = new InvoiceModel(invoice)

  try {
    await newInvoice.save()
    res.status(201).json(newInvoice)
  } catch (error) {
    res.status(409).json(error.message)
  }

}

// const getInvoice = async (req, res) => {

//     const { id: _id } = req.params;
//     console.log("Inside getInvoice", _id);

//     try {
//         const invoice = await InvoiceModel.findById(_id);

//         res.status(200).json(invoice);
//     } catch (error) {
//         res.status(409).json({ message: error.message });
//     }
// }


const getInvoice = async (req, res) => {

  const { id: _id } = req.params;

  try {
    const invoice = await getInvoiceInternal(_id);

    res.status(200).json(invoice);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}


const updateInvoice = async (req, res) => {
  const { id: _id } = req.params;
  const invoice = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send('No invoice with that id');
  }

  try {

    let updateObject = { ...invoice };


    if (invoice.paymentRecords && Object.keys(invoice.paymentRecords).length > 0) {
      updateObject.status = 'Paid';
    }


    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      _id,
      updateObject,
      { new: true }
    );

    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).send('Error updating invoice');
  }
}


const deleteInvoice = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No invoice with that id');

  try {
    await InvoiceModel.findByIdAndDelete(id);
    res.json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    res.status(500).send('Error deleting customer');
  }
}



const getInvoiceInternal = async (invoiceId) => {
  try {
    const invoice = await InvoiceModel.findById(invoiceId);
    return invoice;
  } catch (error) {
    return { message: error.message };
  }
}



const generatePDF = async (req, res) => {
  let invoiceData = await getInvoiceInternal(req.params.id);


  const creatorIds = invoiceData.creator;

  const profile = await ProfileModel.findOne({ userId: creatorIds });


  let htmlContent = getHtmlTemplate(invoiceData,profile);

  
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send('Error generating PDF');
  }
}


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});


const sendInvoiceEmail = async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;


  let invoiceData = await getInvoiceInternal(req.params.id);
  
  const creatorIds = invoiceData.creator;

  const profile = await ProfileModel.findOne({ userId: creatorIds });


  let htmlContent = getHtmlTemplate(invoiceData,profile);


  try {
    if (!email) {
      return res.status(400).send('Email is required');
    }



    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length
    });


    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Invoice PDF',
      text: 'Please find attached the invoice PDF.',
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    res.status(500).send('Error sending invoice email');
  }
};



// HTML template function
const getHtmlTemplate = (data,profile) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <title>Invoice</title>
  <style>
    .invoice-container {
      padding: 20px;
    }
  </style>

</head>
<body>
  <div class="container invoice-container" id="invoice-container">
    <div class="row">
      <div class="col-7">
       <h4>BILL FROM</h4>
        <div>
          <strong>Name:</strong> ${profile.name} <br>
          <strong>Email:</strong> ${profile.email} <br>
          <strong>Phone Number:</strong> ${profile.phoneNumber} <br>
          <strong>Address:</strong> ${profile.contactAddress}
        </div>
      </div>
      <div class="col-5 text-right">
        <h1 class="document-type display-4">INVOICE</h1>
        <div><strong>Invoice #:</strong> ${data.invoiceNumber}</div>
      </div>
    </div>

    


    <div class="row">
      <div class="col-7 mt-5 mb-3">
        <h4>BILL TO</h4>
        <div>
          <strong>Name:</strong> ${data.client.name} <br>
          <strong>Email:</strong> ${data.client.email} <br>
          <strong>Phone Number:</strong> ${data.client.phone} <br>
          <strong>Address:</strong> ${data.client.address}
        </div>
      </div>
      <div class="col-5 text-right">
        <div>
          <strong>STATUS:</strong> ${data.status}
        </div>
        <div>
          <strong>DATE:</strong> ${new Date().toLocaleDateString()}
        </div>
        <div>
          <strong>DUE DATE:</strong> ${new Date(data.dueDate).toLocaleDateString()}
        </div>
        <div>
          <strong>AMOUNT:</strong> ${data.currency} ${data.total}
        </div>
      </div>
    </div>
    <h6>Items</h6>
    <table class="table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Disc(%)</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>${item.itemName}</td>
            <td>${item.quantity}</td>
            <td>${item.unitPrice}</td>
            <td>${item.discount}</td>
            <td>${item.amount}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <h6>Invoice Summary</h6>
    <table class="table">
      <tbody>
        <tr>
          <td><strong>Sub Total</strong></td>
          <td class="text-right">${data.subTotal}</td>
        </tr>
        <tr>
          <td>VAT(%)</td>
          <td class="text-right">${data.vat}</td>
        </tr>
        <tr>
          <td><strong>Total</strong></td>
          <td class="text-right">${data.total}</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-5">
      <div><strong>Tax Rate (%):</strong> ${data.taxRate != null ? data.taxRate : 'NA'}</div>
      <div><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</div>
      <div><strong>Select Currency:</strong> ${data.currency}</div>
    </div>
    <div class="mt-5">
      <strong>Note/Payment Info:</strong>
      <div>${data.notes}</div>
    </div>
  </div>
</body>
</html>
`;


module.exports = { sendInvoiceEmail, nextInvoiceNumber, getInvoicesByUser, getTotalCount, getInvoices, createInvoice, getInvoice, updateInvoice, deleteInvoice, getInvoiceStatusCounts, getInvoiceInternal, generatePDF }; 