var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var app = express();

mongoose.connect('mongodb://localhost:27017/db');

var serviceSchema = new Schema({
  name: String,
  lat: Number,
  lon: Number,
  type: String
});

var Service = mongoose.model('Service', serviceSchema);

app.get('/', function(req, res) {
  res.send("Hello World!! :)");
});

app.get('/services', function(req, res) {
  Service.find({},function(err,results) {
    if (err){
      console.log("AN ERROR OCCURRED");
    }
    console.log("found items: ");
    console.log(results);
    res.send(results);
  });
});

app.listen(80);
