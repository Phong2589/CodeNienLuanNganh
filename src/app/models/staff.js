const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staff = new Schema({
    user: { type: String},
    password: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('staff', staff);