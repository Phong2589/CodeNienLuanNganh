const express = require('express');
const router = express.Router();

const multer  = require('multer')
const upload = multer({ dest: 'src/public/img/' })

const adminController = require('../app/controllers/adminController');


router.get('/addProduct', adminController.addProduct);
router.post('/addProductDB', upload.single('image'), adminController.addProductDB);
router.get('/', adminController.home);

module.exports = router;