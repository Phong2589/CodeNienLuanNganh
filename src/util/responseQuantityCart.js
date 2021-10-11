
const cart = require('../app/models/cart')

module.exports.quantityCart = async function (req, res, next) {
    if(req.signedCookies.cusId){
        var cartDb = await cart.findOne({cusId: req.signedCookies.cusId})
        
        var quantity = 0
        for (var i = 0; i < cartDb.cart.length; i++) {
            quantity = quantity + cartDb.cart[i].quantityBuy;
        }
        res.locals.quantityCart = quantity 
        
    }
    else{
        res.locals.quantityCart = 0
    }
    next()
}