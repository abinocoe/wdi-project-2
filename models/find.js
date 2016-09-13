const mongoose = require('mongoose');

const findSchema = new mongoose.Schema({
  objectType      : { type:String, trim:true },
  broadPeriod     : { type:String, trim:true },
  description     : { type:String, trim:true },
  inscription     : { type:String, trim:true },
  mintName        : { type:String, trim:true },
  district        : { type:String, trim:true },
  parish          : { type:String, trim:true },
  lat             : { type:String },
  lng             : { type:String },
  fromDate        : { type:Number },
  toDate          : { type:Number },
  imageURL        : { type:String, trim:true },
  discoveryMethod : { type:String, trim:true },
  subsequently    : { type:String, trim:true}
}, {
  timestamps: true
});

module.exports = mongoose.model("Find", findSchema);
