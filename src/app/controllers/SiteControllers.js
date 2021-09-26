
const customer = require('../models/customer')
const admin = require('../models/admin')
const staff = require('../models/staff')
const product = require('../models/product')
const md5 = require('md5');

const {mutipleMongooseToObject} = require('../../util/mongoose')

class SiteController {
     index(req, res,next) {
        // product.find({},function (err, products) {
        //     customer.find({})
        //     .then(customers => {
        //         res.render('home',{
        //             customers: mutipleMongooseToObject(customers),
        //             products: mutipleMongooseToObject(products),
        //         })
        //     })
        //     .catch(next);
        // })
        product.find({},function (err, products) {
            res.render('home',{
                    products: mutipleMongooseToObject(products),
                })
        })
        
    }
    //get -> new
    new(req, res, next) {
        res.render('test', { title: 'my other page', layout: 'customer' });
    }
    //post -> register
    register(req,res,next)
    {
        req.body.password = md5(req.body.password);
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
        var user = req.body.userLogin;
        var pass = req.body.passwordLogin;
        customer.findOne({user: user, password: md5(pass)})
            .then((data)=>{
                if(data!=null) {
                    req.session.message = {
                        type: 'success',
                        intro: 'Chúc mừng bạn đăng nhập thành công!',
                        message: ''
                      }
                    res.cookie('cusId',data.id,{
                        signed: true
                    })
                    res.redirect('/customer')
                }
                else {
                    admin.findOne({user: user, password: md5(pass)})
                        .then((data1)=>{
                            if(data1!=null) {
                                req.session.message = {
                                    type: 'success',
                                    intro: 'Chúc mừng bạn đăng nhập thành công!',
                                    message: ''
                                }
                                res.cookie('adminId',data1.id,{
                                    signed: true
                                })
                                res.redirect('/admin')
                            }
                            else {
                                staff.findOne({user: user, password: md5(pass)})
                                    .then((data2)=>{
                                        if(data2!=null) {
                                            req.session.message = {
                                                type: 'success',
                                                intro: 'Chúc mừng bạn đăng nhập thành công!',
                                                message: ''
                                            }
                                            res.cookie('staffId',data2.id,{
                                                signed: true
                                            })
                                            res.redirect('/staff')
                                        }
                                        else {
                                            req.session.message = {
                                                type: 'warning',
                                                intro: 'Đăng nhập thất bại! ',
                                                message: 'Hãy đăng nhập lại nào.'
                                              }
                                            res.redirect('/')
                                        }
                                    })
                            }
                        })
                }
            })
            .catch(next)
        
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
    detailProduct(req,res,next){
        product.findOne({slug : req.params.slug})
            .then((data)=>{
                res.json(data)
            })
            .catch(next)
    }
}

module.exports = new SiteController();
