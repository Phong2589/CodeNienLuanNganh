const express = require('express');
const router = express.Router();


const staffController = require('../app/controllers/staffController');

router.get('/sortaz',staffController.sortaz);
router.get('/sortza',staffController.sortza);
router.get('/sortCostIncrease',staffController.sortCostIncrease);
router.get('/sortCostDecrease',staffController.sortCostDecrease);
router.get('/search',staffController.search);
router.get('/detailProduct/:slug',staffController.detailProduct);
router.get('/logout', staffController.logout);
router.get('/revenueDay',staffController.revenueDay);
router.get('/profile',staffController.profile);
router.get('/changePassword',staffController.changePassword);
router.get('/checkPassword',staffController.checkPassword);
router.post('/changePassAdPro',staffController.changePassAdPro);




router.get('/', staffController.home);


module.exports = router;
