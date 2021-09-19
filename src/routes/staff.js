const express = require('express');
const router = express.Router();


const staffController = require('../app/controllers/staffController');


router.get('/', staffController.home);


module.exports = router;
