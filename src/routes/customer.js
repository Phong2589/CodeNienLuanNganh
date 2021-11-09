const express = require('express');
const path = require('path');
const router = express.Router();
const passport = require('passport');
const multer  = require('multer')
// console.log(path.resolve(__dirname, '../public/img'))
// console.log(path.join(__dirname, '../public/img/'))
const upload = multer({ dest: './src/public/img/'})
// const fileStoge = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,path.resolve(__dirname, '../public/img/'))
//     },
//     filename: (req,file,cb)=>{
//         cb(null,Date.now() + "--" + file.originalname)
//     },
// })
// const upload = multer({storage : fileStoge})

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
router.get('/search',customerController.search);
router.get('/logOut',customerController.logOut);
router.get('/awaitingConfirm',customerController.awaitingConfirm);
router.get('/cancelOrder/:orderId',customerController.cancelOrder);
router.get('/confirmed',customerController.confirmed);
router.get('/history',customerController.history);
router.get('/changePassword',customerController.changePassword);
router.post('/changePassCusPro',customerController.changePassCusPro);
router.get('/checkPassword',customerController.checkPassword);
router.get('/sortNew',customerController.sortNew);
router.get('/changeAvatar',customerController.changeAvatar);
router.get('/changeAvatarCusDB', customerController.changeAvatarCusDB);


//upload.single('image'),


router.get('/', customerController.customer);



module.exports = router;