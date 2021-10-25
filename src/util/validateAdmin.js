const admin = require('../app/models/admin')

module.exports.requireAuth = async function(req,res,next){
    if(!req.signedCookies.adminId) {
        req.session.message = {
            type: 'warning',
            intro: 'Bạn chưa đăng nhập! ',
            message: 'Hãy đăng nhập lại nào.'
          }
        res.redirect('/')
    }
    else
    {
        var data = await admin.findOne({_id: req.signedCookies.adminId})
        if(data == null) {
            req.session.message = {
                type: 'warning',
                intro: 'Đăng nhập thất bại! ',
                message: 'Hãy đăng nhập lại nào.'
              }
            res.redirect('/')
        }
        else {
            res.locals.admin = data._doc;
            next();
        }
    }
}