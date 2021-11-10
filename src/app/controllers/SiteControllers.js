
const customer = require('../models/customer')
const admin = require('../models/admin')
const staff = require('../models/staff')
const product = require('../models/product')
const cart = require('../models/cart')
const google = require('../models/google')
const facebook = require('../models/facebook')
const profileCustomer = require('../models/profileCustomer')
const sha512 = require('js-sha512').sha512

const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose');
const { createSessionID } = require('../../util/createCartDB');
const { Store } = require('express-session');

class SiteController {
    async index(req, res, next) {

        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find({ quantity: { $gte: 1 } })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)

        res.render('home', {
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }

    //post -> register
    register(req, res, next) {
        req.body.password = sha512(req.body.password);
        const customerNew = new customer(req.body);
        customerNew.image = "https://res.cloudinary.com/pqshop/image/upload/v1636549194/image/avatarDefault_qdriw6.png"
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
        var pass = sha512(req.body.passwordLogin)
        //customer
        var data = await customer.findOne({ user: user, password: pass })
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
            var dataDb = await cart.findOne({ cusId: data.id })
            if (dataDb == null) {
                const cartNew = new cart()
                cartNew.total = 0
                cartNew.cusId = data.id
                var cartup = await cartNew.save()
                if (cartup) {
                    res.redirect('/customer')
                }
            }
            else {
                res.redirect('/customer')
            }
        }
        else {
            //admin
            var data1 = await admin.findOne({ user: user, password: pass })
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
                //staff
                var data2 = await staff.findOne({ user: user, password: pass })
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
                        intro: 'Đăng nhập thất bại!',
                        message: 'Vui lòng đăng nhập lại!'
                    }
                    res.redirect('back')
                }
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
    async detailProduct(req, res, next) {
        var data = await product.findOne({ slug: req.params.slug })
        var products = await product.aggregate([{ $sample: { size: 8 } }])
        var googleFind = await google.findOne({ _id: req.signedCookies.cusId })
        var facebookFind = await facebook.findOne({ _id: req.signedCookies.cusId })
        var data1 = await customer.findOne({ _id: req.signedCookies.cusId })
        if (!req.signedCookies.cusId) {
            res.render('detailProductCustomer', {
                product: MongooseToObject(data),
                products
            })
        }
        else {
            if (data1) {
                res.locals.cus = data1._doc
            }
            else if (googleFind) {
                res.locals.cus = googleFind._doc;
            }
            else if (facebookFind) {
                res.locals.cus = facebookFind._doc;
            }
            else {
                res.locals.cus = "khong biet"
            }
            res.render('detailProductCustomer', {
                product: MongooseToObject(data),
                products,
                layout: 'customer',
            })
        }

    }


    async cart(req, res, next) {

        if (req.signedCookies.cusId) {
            var cusId = req.signedCookies.cusId
            var cartElement = await cart.findOne({ cusId: cusId })
            var findProfile = await profileCustomer.findOne({ cusId: cusId })
            var customerCurrent = await customer.findOne({ _id: cusId })
            var googleFind = await google.findOne({ _id: req.signedCookies.cusId })
            var facebookFind = await facebook.findOne({ _id: req.signedCookies.cusId })
            if (customerCurrent) {
                res.locals.cus = customerCurrent._doc;
            }
            else if (googleFind) {
                res.locals.cus = googleFind._doc;
            }
            else if (facebookFind) {
                res.locals.cus = facebookFind._doc;
            }
            else {
                res.locals.cus = "khong biet"
            }
            for (var i = 0; i < cartElement.cart.length; i++) {
                var productFind = await product.findOne({ slug: cartElement.cart[i].slug })
                cartElement.cart[i].quantity = productFind.quantity

            }
            if (cartElement.total == 0) {
                res.render('cart', { layout: 'customer', })
            }
            else {
                res.render('cart', {
                    layout: 'customer',
                    cart: MongooseToObject(cartElement),
                    profile: MongooseToObject(findProfile),
                })
            }
        }
        else {
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

    registerModal(req, res, next) {
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
        else {
            res.json('')
            return
        }
    }
    async sortaz(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "name": 1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)


        res.render('homeCustomer', {
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async sortza(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "name": -1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)

        res.render('homeCustomer', {
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async sortCostDecrease(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "cost": -1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)


        res.render('homeCustomer', {
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async sortCostIncrease(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "cost": 1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)

        res.render('homeCustomer', {
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async sortNew(req, res, next) {
        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find().sort({ "createdAt": -1 })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)

        res.render('homeCustomer', {
            products: mutipleMongooseToObject(products),
            quantityPage: quantityPageArr
        })
    }
    async search(req, res, next) {

        var page = parseInt(req.query.page)
        if (!page) page = 1
        var perPage = 16
        var start = (page - 1) * perPage
        var end = page * perPage
        var products = await product.find({ $text: { $search: req.query.search } })
        var quantityPage = Math.ceil(products.length / perPage)
        var quantityPageArr = []
        for (var i = 0; i < quantityPage; i++) {
            quantityPageArr[i] = i + 1
        }
        products = products.slice(start, end)


        if (products) {
            res.render('searchCustomer', {
                products: mutipleMongooseToObject(products),
                quantityPage: quantityPageArr
            })
        }
        else {
            res.render('searchCustomer')
        }
    }

    // register with google
    async success(req, res, next) {
        var findEmail = await google.findOne({ email: req.user.email })
        if (findEmail) {
            req.session.message = {
                type: 'warning',
                intro: 'Email này đã đăng kí! ',
                message: 'Hãy đăng nhập ngay nào.'
            }
            res.redirect('/')
        }
        else {
            const googleNew = new google()
            googleNew.email = req.user.email
            googleNew.user = req.user.given_name + ' ' + req.user.family_name
            googleNew.image = req.user.picture
            var result = await googleNew.save()
            req.session.message = {
                type: 'success',
                intro: 'Đăng kí tài khoản thành công! ',
                message: 'Hãy đăng nhập ngay nào.'
            }
            res.redirect('/')
        }
    }
    fail(req, res, next) {
        res.send('Đăng kí thất bại')
    }
    // log in with google
    async successLogin(req, res, next) {
        var findEmail = await google.findOne({ email: req.user.email })
        if (findEmail) {
            res.cookie('cusId', findEmail.id, {
                signed: true,
                maxAge: 1000 * 60 * 60 * 2
            })
            var dataDb = await cart.findOne({ cusId: findEmail.id })
            if (dataDb == null) {
                const cartNew = new cart()
                cartNew.total = 0
                cartNew.cusId = findEmail.id
                var cartup = await cartNew.save()
            }
            req.session.message = {
                type: 'success',
                intro: 'Đăng nhập thành công! ',
                message: ''
            }
            res.redirect('/customer')
        }
        else {
            req.session.message = {
                type: 'warning',
                intro: 'Đăng nhập thất bại! ',
                message: 'Hãy đăng nhập lại nào.'
            }
            res.redirect('/')
        }

    }
    failLogin(req, res, next) {
        res.send('Đăng nhập thất bại')
    }

    async successRegisterFace(req, res, next) {
        var findId = await facebook.findOne({ idFace: req.user.id })
        if (findId) {
            req.session.message = {
                type: 'warning',
                intro: 'Tài khoản Facebook này đã đăng kí! ',
                message: 'Hãy đăng nhập ngay nào.'
            }
            res.redirect('/')
        }
        else {
            const facebookNew = new facebook()
            facebookNew.idFace = req.user.id
            facebookNew.user = req.user.displayName
            facebookNew.image = req.user.photos[0].value
            var result = await facebookNew.save()
            req.session.message = {
                type: 'success',
                intro: 'Đăng kí tài khoản thành công! ',
                message: 'Hãy đăng nhập ngay nào.'
            }
            res.redirect('/')
        }
    }

    async successloginFace(req, res, next) {
        // res.json(req.user)
        // res.send('abs')
        if (req.user.id) {
            var findId = await facebook.findOne({ idFace: req.user.id })
            if (findId) {
                res.cookie('cusId', findId.id, {
                    signed: true,
                    maxAge: 1000 * 60 * 60 * 2
                })
                var dataDb = await cart.findOne({ cusId: findId.id })
                if (dataDb == null) {
                    const cartNew = new cart()
                    cartNew.total = 0
                    cartNew.cusId = findId.id
                    var cartup = await cartNew.save()
                }
                req.session.message = {
                    type: 'success',
                    intro: 'Đăng nhập thành công! ',
                    message: ''
                }
                res.redirect('/customer')
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Đăng nhập thất bại! ',
                    message: 'Hãy đăng nhập lại nào.'
                }
                res.redirect('/')
            }

        }
        else {
            req.session.message = {
                type: 'warning',
                intro: 'Đăng nhập thất bại! ',
                message: 'Hãy đăng nhập lại nào.'
            }
            res.redirect('/')
        }

    }

}

module.exports = new SiteController();
