const customer = require('../app/models/customer')
const cart = require('../app/models/cart')


module.exports.requireAuth = function(req,res,next){
    if(!req.signedCookies.cusId) {
        req.session.message = {
            type: 'warning',
            intro: 'Bạn chưa đăng nhập!! ',
            message: 'Hãy đăng nhập lại nào.'
          }
        res.redirect('/')
    }
    else
    {
        customer.findOne({id: req.signedCookies.cusId})
            .then((data)=>{
                if(data == null) {
                    req.session.message = {
                        type: 'warning',
                        intro: 'Đăng nhập thất bại! ',
                        message: 'Hãy đăng nhập lại nào.'
                      }
                    res.redirect('/')
                }
                else 
                {
                    cart.findOne({ sessionID: sessionID },function(err,data){
                        var quantity=0
                        for (var i = 0; i < data.cart.length; i++) {
                            quantity = quantity + data.cart[i].quantityBuy;
                        }
                        res.locals.quantityCart = quantity
                    })
                    res.locals.cus = data._doc;
                    
                    next();
                }
            })
    }
}