const express = require('express');
const router = express.Router();


const customerController = require('../app/controllers/customerController');


router.get('/', customerController.customer);



module.exports = router;
