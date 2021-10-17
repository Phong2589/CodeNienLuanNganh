const customer = require('../app/models/customer')
const cart = require('../app/models/cart')


module.exports.requireAuth = async function(req,res,next){
    if(!req.signedCookies.cusId) {
        req.session.message = {
            type: 'warning',
            intro: 'Bạn chưa đăng nhập! ',
            message: 'Hãy đăng nhập ngay nào.'
          }
        res.redirect('/')
    }
    else
    {
        var data = await customer.findOne({_id: req.signedCookies.cusId})
        var cartDb = await cart.findOne({cusId: req.signedCookies.cusId})
        if(cartDb){
            var quantity = 0
            for (var i = 0; i < cartDb.cart.length; i++) {
                quantity = quantity + cartDb.cart[i].quantityBuy;
            }
            res.locals.quantityCart = quantity 
            res.locals.cus = data._doc;
            next();
        }
        else{
            req.session.message = {
                type: 'warning',
                intro: 'Đăng nhập thất bại! ',
                message: 'Hãy đăng nhập lại nào.'
              }
            res.redirect('/')
        }
    }
}