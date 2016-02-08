var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/contact_list');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var ContactList = require('./models/contactList.js');
var User = require('./models/user.js');

// AUTHENTICATION ROUTES

// /api/users
app.post('/api/users', function(req, res){
  var userData = req.body.user;
  var newUser = new User(userData);
  newUser.save(function(err, databaseUser){
    res.redirect('/'); // highly ?able beacuse this is an API
  });
});

//api/users/authenticate
app.post('/api/users/authenticate', function(req , res){
  console.log('Authenticate Tried');
  var usernameTry = req.body.username;
  var passwordTry = req.body.password;
  User.findOne({username: usernameTry}, function(err, databaseUser){
    databaseUser.authenticate(passwordTry, function(err, isMatch){
      if(isMatch){
        databaseUser.setToken(function(){
          res.json({description: 'password right-o', token: databaseUser.token});
        });

      }else{
        res.json({description: 'no good on that password'});
       }
    });
  });
});

// CONTACT LIST ROUTES

app.get('/contactlist', function (req, res) {
  ContactList.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/contactlist', function (req, res) {
  console.log(req.body);
  ContactList.create(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  ContactList.findByIdAndRemove(id, function (err, doc) {
    res.json(doc);
  });
});

app.get('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  ContactList.findById(id, function (err, doc) {
    res.json(doc);
  });
});

app.put('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  ContactList.findByIdAndUpdate(id, {
      $set: {
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        animal: req.body.animal
      }
  }, {new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

app.get('/', function(req, res){
  res.sendFile( __dirname + '/views/index.html');
});

var port = 8080;
app.listen(port, function(){
  console.log('...listening on port ' + port);
});
