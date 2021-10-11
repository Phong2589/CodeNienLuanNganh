const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cart = new Schema({
    cusId: {type: String},
    cart: {type: Array},
    total: {type: Number},
    
  },{
    timestamps: true,
  });

module.exports = mongoose.model('cart', cart);