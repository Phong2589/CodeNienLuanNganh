const express = require('express');
const router = express.Router();


const customerController = require('../app/controllers/customerController');


router.get('/decreaseProductToCart/:slug',customerController.decreaseProductToCart);
router.get('/deleteProductFromCart/:slug',customerController.deleteProductFromCart);
router.get('/changeProductFromCart/:slug',customerController.changeProductFromCart);
router.get('/orderNow/:slug',customerController.orderNow);
router.get('/profile',customerController.profile);
router.post('/profileProcess',customerController.profileProcess);
router.post('/order', customerController.order);
router.post('/orderNowCustomer/:slug', customerController.orderNowCustomer);
router.get('/sortaz',customerController.sortaz);
router.get('/sortza',customerController.sortza);
router.get('/sortCostIncrease',customerController.sortCostIncrease);
router.get('/sortCostDecrease',customerController.sortCostDecrease);


router.get('/', customerController.customer);



module.exports = router;
