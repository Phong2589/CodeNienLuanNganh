const express = require('express');
const router = express.Router();

const multer  = require('multer')
const upload = multer({ dest: 'src/public/img/' })

const adminController = require('../app/controllers/adminController');


router.get('/addProduct', adminController.addProduct);
router.post('/addProductDB', upload.single('image'), adminController.addProductDB);
router.get('/logout', adminController.logout);
router.get('/changePassword',adminController.changePassword);
router.post('/changePassAdPro',adminController.changePassAdPro);
router.get('/checkPassword',adminController.checkPassword);
router.get('/sortaz',adminController.sortaz);
router.get('/sortza',adminController.sortza);
router.get('/sortCostIncrease',adminController.sortCostIncrease);
router.get('/sortCostDecrease',adminController.sortCostDecrease);
router.get('/search',adminController.search);
router.get('/detailProduct/:slug',adminController.detailProduct);


router.get('/', adminController.home);

module.exports = router;
