
const customer = require('../models/customer')
const admin = require('../models/admin')
const staff = require('../models/staff')
const product = require('../models/product')
const md5 = require('md5');
const cart = require('../models/cart')

const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose');
const { createSessionID } = require('../../util/createSessionID');

class SiteController {
    index(req, res, next) {
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
        product.find({}, function (err, products) {
            
            res.render('home', {
                products: mutipleMongooseToObject(products),
            })
        })

    }
    //get -> new
    new(req, res, next) {
        res.render('test', { title: 'my other page', layout: 'customer' });
    }
    //post -> register
    register(req, res, next) {
        req.body.password = md5(req.body.password);
        const customerNew = new customer(req.body);
        customerNew.save()
            .then(() => {
                req.session.message = {
                    type: 'success',
                    intro: 'Chúc mừng bạn đã tạo tài khoản thành công! ',
                    message: 'Hãy đăng nhập ngay nào.'
                }
                res.redirect('back')
            }
            )
            .catch(error => { })
    }
    //post -> login
    login(req, res, next) {
        var user = req.body.userLogin;
        var pass = req.body.passwordLogin;
        customer.findOne({ user: user, password: md5(pass) })
            .then((data) => {
                if (data != null) {
                    req.session.message = {
                        type: 'success',
                        intro: 'Chúc mừng bạn đăng nhập thành công!',
                        message: ''
                    }
                    res.cookie('cusId', data.id, {
                        signed: true,
                        maxAge: 1000 * 60 * 60 * 2
                    })
                    res.redirect('/customer')
                }
                else {
                    admin.findOne({ user: user, password: md5(pass) })
                        .then((data1) => {
                            if (data1 != null) {
                                req.session.message = {
                                    type: 'success',
                                    intro: 'Chúc mừng bạn đăng nhập thành công!',
                                    message: ''
                                }
                                res.cookie('adminId', data1.id, {
                                    signed: true,
                                    maxAge: 1000 * 60 * 60 * 2
                                })
                                res.redirect('/admin')
                            }
                            else {
                                staff.findOne({ user: user, password: md5(pass) })
                                    .then((data2) => {
                                        if (data2 != null) {
                                            req.session.message = {
                                                type: 'success',
                                                intro: 'Chúc mừng bạn đăng nhập thành công!',
                                                message: ''
                                            }
                                            res.cookie('staffId', data2.id, {
                                                signed: true,
                                                maxAge: 1000 * 60 * 60 * 2
                                            })
                                            res.redirect('/staff')
                                        }
                                        else {
                                            req.session.message = {
                                                type: 'warning',
                                                intro: 'Đăng nhập thất bại! ',
                                                message: 'Hãy đăng nhập lại nào.'
                                            }
                                            res.redirect('back')
                                        }
                                    })
                            }
                        })
                }
            })
            .catch(next)
    }

    checkUserDatabase(req, res, next) {
        customer.findOne({ user: req.query.user })
            .then((data) => {
                if (data == null) {
                    staff.findOne({ user: req.query.user })
                        .then((data1) => {
                            if (data1 == null) {
                                admin.findOne({ user: req.query.user })
                                    .then((data2) => {
                                        if (data2 == null) res.send("")
                                        else res.send("Tên tài khoản đã tồn tại vui lòng chọn tên khác!")
                                    })
                            }
                            else res.send("Tên tài khoản đã tồn tại vui lòng chọn tên khác!")
                        })
                }
                else res.send("Tên tài khoản đã tồn tại vui lòng chọn tên khác!")
            })
            .catch(next)
    }
    detailProduct(req, res, next) {
        product.findOne({ slug: req.params.slug }, function (err, data) {
            product.aggregate([{ $sample: { size: 10 } }])
                .then((products) => {
                    res.render('detailProductCustomer', {
                        product: MongooseToObject(data),
                        products
                    })
                })
                .catch(next)
        })
    }
    async addProductToCart(req, res, next) {
        var slug = req.params.slug
        var sessionID = req.signedCookies.sessionID
        if (!sessionID) {
            res.send('Lỗi! Không thể thêm sản phẩm vào giỏ hàng!')
            return
        }
        try{
            var count=0,cartup
            var cartElement = await cart.findOne({ sessionID: sessionID })
            if(cartElement){
                for(var i=0;i<cartElement.name.length;i++){
                    if(cartElement.name[i] == slug){
                        cartElement.quantity[i] = cartElement.quantity[i] + 1
                        cartup = await cart.updateOne({sessionID: sessionID},{quantity : cartElement.quantity})
                        count=1
                        break
                    }
                }
            } 
            if(count==0){
                var cartElementNew = await cart.findOne({ sessionID: sessionID })
                cartElementNew.name[cartElementNew.name.length] = await slug
                cartElementNew.quantity[cartElementNew.quantity.length] = 1
                var result = await cart.updateOne({sessionID: sessionID},{quantity : cartElementNew.quantity,name:cartElementNew.name})
                res.send('7')
            }
            else{
                res.send('7')
            }
            
            
        }
        catch(error)
        {
            res.json(error)
        }
    }
}

module.exports = new SiteController();
