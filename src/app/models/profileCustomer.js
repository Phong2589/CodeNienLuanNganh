const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileCustomer = new Schema({
    cusId: {type: String},
    name: { type: String},
    phone: { type: String},
    address: { type: String},
    note: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('profileCustomer', profileCustomer);