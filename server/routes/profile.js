const express = require('express');
const { getProfiles, createProfile, updateProfile, deleteProfile, getProfile, getProfilesByUser } = require('../controllers/profile.js');

const router = express.Router()

router.get('/:id', getProfile)
router.get('/', getProfiles)
router.get('/user/', getProfilesByUser)
router.post('/add', createProfile)
router.put('/update/:id', updateProfile)
router.delete('/delete/:id', deleteProfile)


module.exports = router;