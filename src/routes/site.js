const express = require('express');
const router = express.Router();
const passport = require('passport');
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
router.get('/sortNew',sitecontroller.sortNew);

const { register } = require('../util/middle');
const { login } = require('../util/middle');

// register with google
router.get('/success',sitecontroller.success);
router.get('/fail',sitecontroller.fail);
router.get('/registerGoogle',register,
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
));
router.get('/registerGoogle/callback',
    passport.authenticate( 'google', {
        successRedirect: '/success',
        failureRedirect: '/fail'
}));
// log in with google
router.get('/successLogin',sitecontroller.successLogin);
router.get('/failLogin',sitecontroller.failLogin);
router.get('/loginGoogle',login,
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
));
router.get('/loginGoogle/callback',
    passport.authenticate( 'google', {
        successRedirect: '/successLogin',
        failureRedirect: '/failLogin'
}));

//register with facebook
router.get('/successRegisterFace',sitecontroller.successRegisterFace);

router.get('/registerFacebook',
passport.authenticate('facebook'));

router.get('/registerFacebook/callback',
passport.authenticate('facebook', { failureRedirect: '/fail' }),
function(req, res) {
  res.redirect('/successRegisterFace');
});




router.get('/:slug', sitecontroller.detailProduct);
router.get('/', sitecontroller.index);

module.exports = router;
