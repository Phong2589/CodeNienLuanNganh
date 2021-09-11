
const customer = require('../models/customer')
const {mutipleMongooseToObject} = require('../../util/mongoose')

class SiteController {
     index(req, res,next) {
        customer.find({})
            .then(customers => {
                res.render('home',{
                    customers: mutipleMongooseToObject(customers)
                })
            })
            .catch(next);
    }
    //get -> new
    new(req, res, next) {
        
        res.render('test', { title: 'my other page', layout: 'customer' });
    }
    //post -> register
    register(req,res,next)
    {
        const customerNew = new customer(req.body);
        customerNew.save()
            .then(()=>{
                // alert("Chúc mừng bạn đăng kí tài khoản thành công!")
                res.redirect('/?register=true')
            }
            )
            .catch(error=>{})
    }
    //post -> login
    login(req,res,next)
    {
        res.json(req.body);
    }
    
    checkUserDatabase(req,res,next)
    {
        customer.findOne({user : req.query.user})
            .then((data)=>{
                if(data == null) res.send("")
                else res.send("Tên tài khoản đã tồn tại vui lòng chọn tên khác!")
            })
            .catch(next)
    }
}

module.exports = new SiteController();
