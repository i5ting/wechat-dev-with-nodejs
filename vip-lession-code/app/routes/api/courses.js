var express = require('express');
var router = express.Router();


var User = require('../../models/user')
var Course = require('../../models/course')
var Order = require('../../models/order')


router.get('/', function(req, res, next) {
  Course.find({},function(err, courses){
    res.json({
      status:{
        code:0,
        msg:'sucess'
      },
      data:courses
    });
  });
  
})

module.exports = router;
