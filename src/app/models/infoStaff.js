const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const infostaff = new Schema({
    user: { type: String, unique: true},
    name: { type: String},
    gender: { type: String},
    phone: { type: String},
    address: { type: String}, 
  },{
    timestamps: true,
  });

module.exports = mongoose.model('infostaff', infostaff);