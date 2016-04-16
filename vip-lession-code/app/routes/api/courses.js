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

router.get('/:id', function(req, res, next) {
  var cid = req.params.id; 
  Course.findById(cid, function(err, course){
    res.json({
      status:{
        code:0,
        msg:'sucess'
      },
      data:course
    });
  });
  
})

module.exports = router;
