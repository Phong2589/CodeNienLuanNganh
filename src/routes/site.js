const express = require('express');
const router = express.Router();

const sitecontroller = require('../app/controllers/SiteControllers');


router.post('/register', sitecontroller.register);
router.post('/login', sitecontroller.login);
router.get('/checkUserDatabase', sitecontroller.checkUserDatabase);
router.get('/addProductToCart/:slug',sitecontroller.addProductToCart);
router.get('/decreaseProductToCart/:slug',sitecontroller.decreaseProductToCart);
router.get('/deleteProductFromCart/:slug',sitecontroller.deleteProductFromCart);
router.get('/changeProductFromCart/:slug',sitecontroller.changeProductFromCart);


router.get('/cart', sitecontroller.cart);




router.get('/:slug', sitecontroller.detailProduct);
router.get('/', sitecontroller.index);

module.exports = router;
