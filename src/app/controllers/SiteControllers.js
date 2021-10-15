
const customer = require('../models/customer')
const admin = require('../models/admin')
const staff = require('../models/staff')
const product = require('../models/product')
const md5 = require('md5');
const cart = require('../models/cart')
const profileCustomer = require('../models/profileCustomer')


const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose');
const { createSessionID } = require('../../util/createCartDB');
const { Store } = require('express-session');

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
    async login(req, res, next) {
        var user = req.body.userLogin
        var pass = md5(req.body.passwordLogin)
        //customer
        var data = await customer.findOne({ user: user ,password: pass})
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
            var dataDb = await cart.findOne({cusId:  data.id})
            if(dataDb == null){
                const cartNew = new cart()
                cartNew.total = 0
                cartNew.cusId = data.id
                var cartup = await cartNew.save()
                if(cartup){
                    res.redirect('/customer')
                }
            }
            else{
                res.redirect('/customer')
            } 
        }
        
            
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

                    if (!req.signedCookies.cusId) {
                        res.render('detailProductCustomer', {
                            product: MongooseToObject(data),
                            products
                        })
                    }
                    else {
                        customer.findOne({ id: req.signedCookies.cusId })
                            .then((data1) => {
                                if (data1 == null) {
                                    res.render('detailProductCustomer', {
                                        product: MongooseToObject(data),
                                        products
                                    })
                                }
                                else {
                                    res.locals.cus = data1._doc
                                    res.render('detailProductCustomer', {
                                        product: MongooseToObject(data),
                                        products,
                                        layout: 'customer',
                                    })
                                }
                            })
                    }
                })
                .catch(next)
        })
    }
    async cart(req, res, next) {
        
        if(req.signedCookies.cusId){
            var cusId = req.signedCookies.cusId
            var cartElement = await cart.findOne({ cusId: cusId })
            var findProfile = await profileCustomer.findOne({cusId:cusId})
            var customerCurrent = await customer.findOne({id: cusId})
            res.locals.cus = customerCurrent._doc

            if (cartElement.total == 0) {
                res.render('cart',{layout: 'customer',})
            }
            else {
                res.render('cart', {
                    layout: 'customer',
                    cart: MongooseToObject(cartElement),
                    profile: MongooseToObject(findProfile),
                })
            }
        }
        else{
            res.render('cart')
        }
    }


    async addProductToCart(req, res, next) {
        var slug = req.params.slug
        var cusId = req.signedCookies.cusId
        if (!cusId) {
            res.json('no')
            return
        }
        try {
            var count = 0, cartup
            var cartElement = await cart.findOne({ cusId: cusId })
            var quantity = 0;
            var cartItem = await product.findOne({ slug: slug })
            if (cartElement) {
                for (var i = 0; i < cartElement.cart.length; i++) {
                    quantity = quantity + cartElement.cart[i].quantityBuy;
                }

                for (var i = 0; i < cartElement.cart.length; i++) {
                    if (cartElement.cart[i].slug == slug) {
                        if (cartElement.cart[i].quantityBuy == cartItem.quantity) {
                            quantity -= 1
                            count = 1
                            break
                        }
                        cartElement.cart[i].quantityBuy = cartElement.cart[i].quantityBuy + 1
                        cartElement.cart[i].totalItem = cartElement.cart[i].quantityBuy * cartElement.cart[i].cost
                        cartElement.total = cartElement.total + cartElement.cart[i].cost
                        cartup = await cart.updateOne({ cusId: cusId }, { cart: cartElement.cart, total: cartElement.total })
                        count = 1
                        break
                    }
                }
            }
            quantity += 1;
            if (count == 0) {
                var cartElementNew = await cart.findOne({ cusId: cusId })
                var totalItem = cartItem.cost
                cartElementNew.cart[cartElementNew.cart.length] = {
                    name: cartItem.name,
                    cost: cartItem.cost,
                    image: cartItem.image,
                    description: cartItem.description,
                    quantity: cartItem.quantity,
                    slug: slug,
                    quantityBuy: 1,
                    totalItem: totalItem,
                }
                cartElementNew.total += totalItem;

                var result = await cart.updateOne({ cusId: cusId }, { cart: cartElementNew.cart, total: cartElementNew.total })

            }
            res.json(quantity)
        }
        catch (error) {
            res.json(error)
        }
    }
    
    registerModal(req,res,next){
        req.session.message = {
            show: 'show'
        }
        res.redirect('/')
    }
    async orderNow(req, res, next) {
        var cusId = req.signedCookies.cusId
        if (!cusId) {
            res.json('no')
            return
        }
        else{
            res.json('')
            return 
        }
    }
    async sortaz(req, res,next) {
        var products = await product.find().sort({"name":1})
        res.render('homeCustomer', {
            products: mutipleMongooseToObject(products),
        })
    }
    async sortza(req, res,next) {
        var products = await product.find().sort({"name":-1})
        res.render('homeCustomer', {
            products: mutipleMongooseToObject(products),
        })
    }
    async sortCostDecrease(req, res,next) {
        var products = await product.find().sort({"cost":-1})
        res.render('homeCustomer', {
            products: mutipleMongooseToObject(products),
        })
    }
    async sortCostIncrease(req, res,next) {
        var products = await product.find().sort({"cost":1})
        res.render('homeCustomer', {
            products: mutipleMongooseToObject(products),
        })
    }
          
}

module.exports = new SiteController();
