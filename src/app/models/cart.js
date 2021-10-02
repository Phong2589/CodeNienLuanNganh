const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cart = new Schema({
    sessionID: { type: String},
    name: { type: Array},
    quantity: {type:Array}
  },{
    timestamps: true,
  });

module.exports = mongoose.model('cart', cart);