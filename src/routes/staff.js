const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'src/public/img/' })

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
router.get('/awaitingConfirm',staffController.awaitingConfirm);
router.get('/confirmed',staffController.confirmed);
router.get('/history',staffController.history);
router.get('/confirmOrder/:slug',staffController.confirmOrder);
router.get('/cancelOrder/:slug',staffController.cancelOrder);
router.get('/completeOrder/:slug',staffController.completeOrder);
router.get('/sortNew',staffController.sortNew);
router.get('/changeAvatar',staffController.changeAvatar);
router.get('/changeAvatarStaffDB', staffController.changeAvatarStaffDB);




router.get('/', staffController.home);


module.exports = router;
