const express = require('express');
const router = express.Router();
const auth = require('../util/validateRegister')

const customerController = require('../app/controllers/customerController');


router.get('/', auth.requireAuth, customerController.customer);



module.exports = router;
