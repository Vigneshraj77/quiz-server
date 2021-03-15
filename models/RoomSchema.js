const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  roomcode: {
    type: Number,
    required: true
  },  
  roomname: {
      type: String,
      required: true
    },
    host:{
      type: String,
      required:true
    },
    attendees:[{
         aname:{
             type:String
         },
         score:{
             type:Number
         },
    }]
  });
  
module.exports = mongoose.model("room", RoomSchema);