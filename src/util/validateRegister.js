const customer = require('../app/models/admin')
const admin = require('../app/models//admin')
const staff = require('../app/models//staff')

module.exports.requireAuth = function(req,res,next){
    if(!req.cookies.userId) {
        res.send("dang nhap that bai")
    }
    else
    {
        customer.findOne({id: req.cookies.userId})
            .then((data)=>{
                if(data == null) res.send("khng co id nay")
                else next();
            })
    }
}