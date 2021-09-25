const customer = require('../app/models/customer')

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
                    res.locals.cus = data._doc;
                    next();
                }
            })
    }
}