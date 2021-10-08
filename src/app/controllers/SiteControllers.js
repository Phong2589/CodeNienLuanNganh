
const customer = require('../models/customer')
const admin = require('../models/admin')
const staff = require('../models/staff')
const product = require('../models/product')
const md5 = require('md5');
const cart = require('../models/cart')

const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose');
const { createSessionID } = require('../../util/createSessionID');
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
        // res.locals.quantityCart = 0
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
    async cart(req,res,next){
        var sessionID = req.signedCookies.sessionID
        var cartElement = await cart.findOne({ sessionID: sessionID })
        if(cartElement.total == 0){
            res.render('cart')
        }
        else{
            res.render('cart',{
                cart : MongooseToObject(cartElement)
            })
        }
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
            var quantity = 0;
            var cartItem = await product.findOne({ slug: slug })
            if(cartElement){
                for(var i=0;i<cartElement.cart.length;i++){
                    quantity = quantity + cartElement.cart[i].quantityBuy;
                }

                for(var i=0;i<cartElement.cart.length;i++){
                    if(cartElement.cart[i].slug == slug){
                        if(cartElement.cart[i].quantityBuy == cartItem.quantity) {
                            quantity-=1
                            count=1
                            break
                        }
                        cartElement.cart[i].quantityBuy = cartElement.cart[i].quantityBuy + 1
                        cartElement.cart[i].totalItem = cartElement.cart[i].quantityBuy * cartElement.cart[i].cost
                        cartElement.total = cartElement.total + cartElement.cart[i].cost
                        cartup = await cart.updateOne({sessionID: sessionID},{cart: cartElement.cart,total : cartElement.total})
                        count=1
                        break
                    }
                }
            } 
            quantity +=1;
            if(count==0){
                var cartElementNew = await cart.findOne({ sessionID: sessionID })
                var totalItem = cartItem.cost
                cartElementNew.cart[cartElementNew.cart.length] ={
                    name: cartItem.name,
                    cost: cartItem.cost,
                    image: cartItem.image,
                    description: cartItem.description,
                    quantity: cartItem.quantity,
                    slug: slug,
                    quantityBuy : 1,
                    totalItem: totalItem,
                } 
                cartElementNew.total += totalItem;
                
                var result = await cart.updateOne({sessionID: sessionID},{cart : cartElementNew.cart,total : cartElementNew.total})
                
            }
            res.json(quantity)
        }
        catch(error)
        {
            res.json(error)
        }
    }

    async decreaseProductToCart(req, res, next) {
        var slug = req.params.slug
        var sessionID = req.signedCookies.sessionID
        if (!sessionID) {
            res.send('Lỗi! Không thể thể giảm sô lượng sản phẩm trong giỏ hàng!')
            return
        }
        try{
            var cartElement = await cart.findOne({ sessionID: sessionID })
            var quantity = 0,cartup;
            if(cartElement){
                for(var i=0;i<cartElement.cart.length;i++){
                    quantity = quantity + cartElement.cart[i].quantityBuy;
                }

                for(var i=0;i<cartElement.cart.length;i++){
                    if(cartElement.cart[i].slug == slug){
                        
                        cartElement.cart[i].quantityBuy = cartElement.cart[i].quantityBuy - 1
                        cartElement.cart[i].totalItem = cartElement.cart[i].quantityBuy * cartElement.cart[i].cost
                        cartElement.total = cartElement.total - cartElement.cart[i].cost
                        cartup = await cart.updateOne({sessionID: sessionID},{cart: cartElement.cart,total : cartElement.total})
                        break
                    }
                }
            } 
            quantity -=1;
            res.json(quantity)
        }
        catch(error)
        {
            res.json(error)
        }
    }

    async deleteProductFromCart(req, res, next) {
        var slug = req.params.slug
        var sessionID = req.signedCookies.sessionID
        if (!sessionID) {
            res.send('Lỗi! Không thể thể giảm sô lượng sản phẩm trong giỏ hàng!')
            return
        }
        try{
            var cartElement = await cart.findOne({ sessionID: sessionID })
            var cartup,index = 0
            if(cartElement){
                for(var i=0;i<cartElement.cart.length;i++){
                    if(cartElement.cart[i].slug == slug){
                        index = i
                        break
                    }
                }
                cartElement.total = cartElement.total - cartElement.cart[index].totalItem
                cartElement.cart.splice(index,1)

                cartup = await cart.updateOne({sessionID: sessionID},{cart: cartElement.cart,total : cartElement.total})
            }
            res.redirect('back')
        }
        catch(error)
        {
            res.json(error)
        }
    }

    async changeProductFromCart(req, res, next) {
        var slug = req.params.slug
        var quantity = req.query.quantity
        var sessionID = req.signedCookies.sessionID
        if (!sessionID) {
            res.send('Lỗi! Không thể thể giảm sô lượng sản phẩm trong giỏ hàng!')
            return
        }
        try{
            var cartElement = await cart.findOne({ sessionID: sessionID })
            var cartup,total,totalItemOld,totalItemNew
            if(cartElement){
                for(var i=0;i<cartElement.cart.length;i++){
                    if(cartElement.cart[i].slug == slug){
                        totalItemOld = cartElement.cart[i].totalItem
                        cartElement.cart[i].quantityBuy = quantity
                        cartElement.cart[i].totalItem = cartElement.cart[i].cost * cartElement.cart[i].quantityBuy
                        totalItemNew = cartElement.cart[i].totalItem
                        break
                    }
                }
                cartElement.total = cartElement.total + (totalItemNew - totalItemOld)
                cartup = await cart.updateOne({sessionID: sessionID},{cart: cartElement.cart,total : cartElement.total})
            } 
            res.redirect('back')
        }
        catch(error)
        {
            res.json(error)
        }
    }
}

module.exports = new SiteController();
