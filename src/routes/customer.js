const express = require('express');
const router = express.Router();


const customerController = require('../app/controllers/customerController');


router.get('/decreaseProductToCart/:slug',customerController.decreaseProductToCart);
router.get('/deleteProductFromCart/:slug',customerController.deleteProductFromCart);
router.get('/changeProductFromCart/:slug',customerController.changeProductFromCart);
router.get('/profile',customerController.profile);
router.post('/order', customerController.order);
router.get('/', customerController.customer);



module.exports = router;
