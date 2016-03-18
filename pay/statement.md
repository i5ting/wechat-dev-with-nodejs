# 对账单


## 下载对账单

https://pay.weixin.qq.com/index.php/settle/state_account

## 对账

```
var csv = require('csv');
var import_csv = require('import-csv');
var parse = csv.parse;
var fs = require('fs');
var Promise = require('bluebird');
var iconv = require('iconv-lite');
var Order = require('../app/models/order');
var Activity = require('../app/models/activity');
var Wechat = require('../app/models/wechat');
var Contact = require('../app/models/contact');
var DELIVERY = require('../config/delivery_company');
require("../db");

var import_csv = require('import-csv')

var array = [];

import_csv('./1229.csv',function(err, data){
   array.push(data);
   array[0].shift();
   Promise.all(array).then(_for);
}, 'utf-8')

function _for () {
  if(array[0].length > 0) {
    var data = array[0].shift();
    var pay_num = data[0].split('#')[0];
    var type = data[24];
    var deliver_number = data[2].split('`')[0];
    var _company = data[1];
    var company;
    if (_company.indexOf('圆通速递') !=-1){
      company = DELIVERY.Y_T_S_D;
    }if (_company.indexOf('百世汇通') !=-1){
      company = DELIVERY.B_S_H_T;
    }
    if(pay_num&&type&&deliver_number){
      var obj = {
        pay_num : pay_num,
        type : type ,
        deliver_number : deliver_number,
        company : company
      }
      Promise.resolve(obj).then(function (obj) {
        find_order(obj);
      });
    }
  }
}

function find_order (obj) {
  console.log(obj.pay_num + obj.type + obj.deliver_number + 'zzzzzzzzzzzzs');
  Order.oneAsync({pay_num : obj.pay_num}
  ).then(function (order) {
    var d_num = order.delivery_num;
    console.log(d_num + 'dddddddddddddd');
    if (d_num) {
      if (d_num.indexOf(obj.deliver_number) != -1) {
        var d = obj.type + ':' + obj.deliver_number + ';';
        console.log("这个单已经有了，不处理       " + d_num);
      }else {
        var d = d_num + obj.type + ':' + obj.deliver_number + ';';
        console.log("这个单还没有，拼接插入" + d);
        update_order(obj.pay_num, d, obj.company)
      }
    }else{
      console.log("运单号是空的，直接插入");
      var d = obj.type + ':' + obj.deliver_number + ';';
      update_order(obj.pay_num, d, obj.company)
    }
  }).then(function () {
    _for();
  });
}

function update_order (pay_num, d, company) {
  console.log(company);
  return Order.updateAsync({pay_num : pay_num}, {status : "1", delivery_num : d, delivery_company : company}, function (err, result) {
    console.log('-ok=' +result.ok + '-nModified=' +result.nModified  + '- n=' +result.n + '原有单号+拼接');
  })
}
```
