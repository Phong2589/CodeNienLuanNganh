const express = require('express');
const router = express.Router();

const sitecontroller = require('../app/controllers/SiteControllers');


router.post('/register', sitecontroller.register);
router.get('/registerModal', sitecontroller.registerModal);
router.post('/login', sitecontroller.login);
router.get('/checkUserDatabase', sitecontroller.checkUserDatabase);
router.get('/addProductToCart/:slug',sitecontroller.addProductToCart);
router.get('/orderNow/:slug', sitecontroller.orderNow);
router.get('/cart', sitecontroller.cart);
router.get('/sortaz',sitecontroller.sortaz);
router.get('/sortza',sitecontroller.sortza);
router.get('/sortCostIncrease',sitecontroller.sortCostIncrease);
router.get('/sortCostDecrease',sitecontroller.sortCostDecrease);
router.get('/search',sitecontroller.search);

router.get('/:slug', sitecontroller.detailProduct);
router.get('/', sitecontroller.index);

module.exports = router;
