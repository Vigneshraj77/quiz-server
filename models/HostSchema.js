const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HostSchema = new Schema({
  roomcode: {
    type: Number,
    required: true
  },  
  roomname: {
      type: String,
      required: true
    },
    
    questions: {
      type: Array,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    correctanswers: {
      type: Array,
      required: true
    },
    host:{
      type: String,
      required:true
    },
    timer:{
      type: Boolean,
      required:true
    },
    timersec:{
      type: Number,
    },
    cutoff :{
      type : Number,
      required : true
    },
    totallevel:{
      type:Number,
    },
    total:{
      type:Number,
    }
  });
  
module.exports = mongoose.model("hosts", HostSchema);