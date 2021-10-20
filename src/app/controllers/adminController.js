
const product = require('../models/product');
const sha512 = require('js-sha512').sha512
const customer = require('../models/customer')
const order = require('../models/order')
const historyOrder = require('../models/historyOrder')
const { MongooseToObject } = require('../../util/mongoose')
const admin = require('../models/admin')

const {mutipleMongooseToObject} = require('../../util/mongoose')

class adminController {
    home(req, res,next) {
        product.find({},function (err, products) {
            res.render('homeAdmin',{
                    layout: 'admin',
                    products: mutipleMongooseToObject(products),
                })
        })
    }

    addProduct(req, res,next) {
        res.render('addProduct', {layout: 'admin' });
    }
    addProductDB(req,res,next){
        req.body.image = req.file.path.split('\\').slice(2).join('/');
        const productNew = new product(req.body);
        productNew.save()
            .then(() => {
                res.send('thanh cong')
            })
            .catch(next);
    }
    
    logout(req,res,next){
        res.clearCookie("adminId")
        res.redirect('/')
    }
    async changePassword(req, res, next){
        res.render('changePasswordAdmin',{
            layout: 'admin',
        })
    }

    async checkPassword(req,res,next){
        var pass = sha512(req.query.pass)
        var adminId = req.signedCookies.adminId
        var result = await admin.findOne({id: adminId,password: pass})
        if(result){
            res.send("")
        }
        else{
            res.send("no")
        }
    }
    async changePassAdPro(req, res, next){
        var adminId = req.signedCookies.adminId
        var pass = sha512(req.body.newPassword)
        var result = await admin.updateOne({id: adminId},{
            password: pass
        })
        req.session.message = {
            type: 'success',
            intro: 'Chúc mừng bạn đã đổi mật khẩu thành công!',
            message: ''
        }
        res.redirect('/admin')
    }

}

module.exports = new adminController();
