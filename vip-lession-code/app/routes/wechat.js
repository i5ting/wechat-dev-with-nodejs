var express = require('express');
var router = express.Router();
var check_session = require('../middlewares/check_session_is_expired');
var OAuth = require('wechat-oauth');

// 读取配置项
var config      = require('../../config/wechat');
var app_id      = config.app_id;
var app_secret  = config.app_secret;
var domain      = config.domain;

// 微信授权和回调
var client = new OAuth(app_id, app_secret);

// 主页,主要是负责OAuth认真
router.get('/', function(req, res) {
    var url = client.getAuthorizeURL(domain + '/wechat/callback','','snsapi_userinfo');

    // 重定向请求到微信服务器
    res.redirect(url);
})

/**
 * 认证授权后回调函数
 *
 * 根据openid判断是否用户已经存在
 * - 如果是新用户，注册并绑定，然后跳转到手机号验证界面
 * - 如果是老用户，跳转到主页
 */
router.get('/callback', function(req, res) {
    console.log('----weixin callback -----')
    var code = req.query.code;
    var User = require('../models/user');

    client.getAccessToken(code, function (err, result) {
        console.dir(err);
        console.dir(result);
        var accessToken = result.data.access_token;
        var openid = result.data.openid;
        var unionid = result.data.unionid;

        console.log('token=' + accessToken);
        console.log('openid=' + openid);
        console.log('unionid=' + unionid);


        User.find_by_openid(openid, function(err, user){
            console.log('微信回调后，User.find_by_unionid(unionid) 返回的user = ' + user)
            if(err || user == null){
                console.log('经过unionid查询无结果');

                client.getUser(openid, function (err, get_by_openid) {
                    console.log(get_by_openid);
                    var oauth_user = get_by_openid;

                    var _user = new User(oauth_user);
                    _user.username = oauth_user.nickname;

                    _user.save(function(err, user_save) {
                        if (err) {
                            console.log('User save error ....' + err);
                        } else {
                            console.log('User save sucess ....' + err);
                            req.session.current_user = void 0;
                            res.redirect('/users/' + user_save._id + '/verify');
                        }
                    });
                });
            }else{
                console.log('根据unionid查询，用户已经存在')
                // if phone_number exist,go home page
               // if(user.is_valid == true){
                   req.session.current_user = user;
                   res.redirect('/#/home')
                // }else{
  //                   //if phone_number exist,go to user detail page to fill it
  //                   req.session.current_user = void 0;
  //                   res.redirect('/users/' + user._id + '/verify');
  //               }
            }
        });
    });
});


module.exports = router;