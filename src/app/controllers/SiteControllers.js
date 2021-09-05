
//const Cource = require('../models/Cource')
//const {mutipleMongooseToObject} = require('../../util/mongoose')
class SiteController {
     index(req, res,next) {
        res.render('home');
    }
    //get -> search
    new(req, res, next) {
        
        res.render('new', { title: 'my other page', layout: 'other' });
    }
}

module.exports = new SiteController();
