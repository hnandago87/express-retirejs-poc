var express = require('express');
var bodyParser = require('body-parser');

var index = require('./src/indexRoute');

var app  = express();

app.use(express.static(__dirname + '/src/views'));
app.use('/',index);
app.listen(3000, function(err,result){
    console.log("starting server....");
});