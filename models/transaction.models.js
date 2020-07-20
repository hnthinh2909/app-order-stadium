var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
    _id:  mongoose.Types.ObjectId, // String is shorthand for {type: String}
    name: String,
    phone:   Number,
    email: String,
    isComplete: Boolean,
    rangePeople: String,
    time: {
      from: String,
      to: String
    },
    date: {
      day: String,
      month: String
    },
    idSubmit: String
  });

module.exports = mongoose.model("Transaction", transactionSchema);