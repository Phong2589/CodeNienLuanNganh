
const cart = require('../app/models/cart')

module.exports.createCartDB = function(req,res,next){
    if(!req.signedCookies.cusId) {
        res.locals.quantityCart = 0
    }
    next()
}