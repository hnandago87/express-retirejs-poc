var express = require('express');

var indexRoute = express.Router();

indexRoute.use(function(req, res, next) {
    next(); 
});


indexRoute.get('/', function(req,res,next){
    res.render('index.html');
});

module.exports = indexRoute;