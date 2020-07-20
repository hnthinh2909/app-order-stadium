var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id:  Schema.Types.ObjectId , // String is shorthand for {type: String}
    name: String,
    phone:   Number,
    password: String,
    isAdmin: Boolean,
    email: String,
    address: String,
  });

module.exports = mongoose.model("user", UserSchema);