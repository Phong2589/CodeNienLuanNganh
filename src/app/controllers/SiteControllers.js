
const customer = require('../models/customer')
const admin = require('../models/admin')
const staff = require('../models/staff')

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
                req.session.message = {
                    type: 'success',
                    intro: 'Chúc mừng bạn đã tạo tài khoản thành công! ',
                    message: 'Hãy đăng nhập ngay nào.'
                  }
                res.redirect('/')
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
                if(data == null) {
                  staff.findOne({user : req.query.user})
                    .then((data1)=>{
                        if(data1 == null)
                        {
                          admin.findOne({user : req.query.user})
                            .then((data2)=>{
                              if(data2 == null) res.send("")
                              else  res.send("Tên tài khoản đã tồn tại vui lòng chọn tên khác!")
                            })
                        }
                        else res.send("Tên tài khoản đã tồn tại vui lòng chọn tên khác!")
                    })
                }
                else res.send("Tên tài khoản đã tồn tại vui lòng chọn tên khác!")
            })
            .catch(next)
    }
}

module.exports = new SiteController();
