const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin = new Schema({
    user: { type: String},
    password: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('admin', admin);