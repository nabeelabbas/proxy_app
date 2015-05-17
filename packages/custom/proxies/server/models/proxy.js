'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Proxy Schema
 */
var ProxySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  ip_address: {
    type: String,
    required: true,
    trim: true
  },
  company_name: {
    type: String,
    required: true,
    trim: true
  },
  usage: {
    type: Number,
    required: true,
    trim: true  
  },
  port_num: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updated: {
    type: Array
  }
});

/**
 * Validations
 */
//ProxySchema.path('ip_address').validate(function(ip_address) {
//  return !!ip_address;
//}, 'Ip Address cannot be blank');
//
//ProxySchema.path('port_num').validate(function(port_num) {
//  return !!port_num;
//}, 'Port Number cannot be blank');

/**
 * Statics
 */
ProxySchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('proxy', 'ip_address port_num').exec(cb);
};

mongoose.model('Proxy', ProxySchema);
