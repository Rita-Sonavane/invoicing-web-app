const express = require('express');
const {getClients, createClient, updateClient, deleteClient, getClientsByUser} = require('../controllers/clients.js');

const router = express.Router()

router.get('/', getClients)
router.get('/user', getClientsByUser);
router.post('/add', createClient)
router.post('/update/:id', updateClient)
router.delete('/delete/:id', deleteClient)

module.exports = router;