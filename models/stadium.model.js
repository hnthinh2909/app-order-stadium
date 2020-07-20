var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stadiumSchema = new Schema({
    _id:  mongoose.Types.ObjectId, // String is shorthand for {type: String}
    name: String,
    rangePeople:   String,
    address: String,   
  });

module.exports = mongoose.model("stadiums", stadiumSchema);