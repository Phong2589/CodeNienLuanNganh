const shortid = require('shortid')
const cart = require('../app/models/cart')

module.exports.createSessionID = function(req,res,next){
    if(!req.signedCookies.sessionID) {
        var sessionID = shortid.generate()
        res.cookie('sessionID',sessionID,{
            signed: true,
        })
        const cartNew = new cart({
            sessionID:sessionID,
            total:0
        })
        cartNew.save()
    }
    next()
}