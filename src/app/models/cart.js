const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cart = new Schema({
    sessionID: { type: String},
    cart: {type: Array},
    total: {type: Number}
  },{
    timestamps: true,
  });

module.exports = mongoose.model('cart', cart);