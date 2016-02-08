
//models
var mongoose = require('mongoose');

//Schemas
var ContactList = mongoose.Schema({
  name: {type: String},
  email: {type: String},
  number: {type: String},
  animal: {type: String}
});

module.exports = mongoose.model('ContactList', ContactList);
