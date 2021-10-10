
const cart = require('../app/models/cart')

module.exports.quantityCart = async function (req, res, next) {
    var sessionID = req.signedCookies.sessionID
    var findCart = await cart.findOne({ sessionID: sessionID })
    console.log(findCart)
    var quantity=0
    if(findCart){
        for(var i=0;i<findCart.cart.length;i++)
        {
            quantity += findCart.cart[i].quantityBuy
        }
    }
    res.locals.quantityCart = quantity
    
    next()
}