const express = require('express');
const router = express.Router();

const customerController = require('../app/controllers/customerController');


router.get('/', customerController.user);


module.exports = router;
