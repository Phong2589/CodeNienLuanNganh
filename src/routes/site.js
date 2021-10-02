const express = require('express');
const router = express.Router();

const sitecontroller = require('../app/controllers/SiteControllers');


router.post('/register', sitecontroller.register);
router.post('/login', sitecontroller.login);
router.get('/checkUserDatabase', sitecontroller.checkUserDatabase);
router.get('/addProductToCart/:slug',sitecontroller.addProductToCart);



router.get('/:slug', sitecontroller.detailProduct);
router.get('/', sitecontroller.index);

module.exports = router;
