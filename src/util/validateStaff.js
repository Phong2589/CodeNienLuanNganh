const staff = require('../app/models/staff')

module.exports.requireAuth = function(req,res,next){
    if(!req.signedCookies.staffId) {
        req.session.message = {
            type: 'warning',
            intro: 'Bạn chưa đăng nhập!! ',
            message: 'Hãy đăng nhập lại nào.'
          }
        res.redirect('/')
    }
    else
    {
        staff.findOne({id: req.signedCookies.staffId})
            .then((data)=>{
                if(data == null) {
                    req.session.message = {
                        type: 'warning',
                        intro: 'Đăng nhập thất bại! ',
                        message: 'Hãy đăng nhập lại nào.'
                      }
                    res.redirect('/')
                }
                else {
                    res.locals.staff = data._doc;
                    next();
                }
            })
    }
}