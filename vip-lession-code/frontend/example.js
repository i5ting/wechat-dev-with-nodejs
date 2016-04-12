$(function () {
    function getQueryStringByName(name){
      var result = location.hash.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
      if(result == null || result.length < 1){
        return "";
      }
      return result[1];
    }
    
    var all_courses_html;
    $.getJSON('/api/courses',function(res){
      // alert(res)
      var item_html = ""
      for(var i in res.data){
        console.log(i);
        var course = res.data[i];
        
        var item = "  <a href='#/course?id=" + course._id + "' class='weui_media_box weui_media_appmsg'>"
                  +"    <div class='weui_media_hd'>"
                  +"        <img class='weui_media_appmsg_thumb' src='" + course.pic + "' alt=''>"
                  +"    </div>"
                  +"    <div class='weui_media_bd'>"
                  +"        <h4 class='weui_media_title'>" + course.name + "</h4>"
                  +"        <p class='weui_media_desc'>" + course.desc + "</p>"
                  +"    </div>"
                  +"  </a>"
        
        item_html += item;
      }
      
      all_courses_html = "<div class='weui_panel_bd'> " + item_html + " </div><a class='weui_panel_ft' href='javascript:void(0);'>查看更多</a>"
      // alert(all);
      
      $('.course_list').html(all_courses_html);
    })
  
    var router = new Router({
        container: '#container',
        enterTimeout: 250,
        leaveTimeout: 250
    });

 

    // article
    var article = {
        url: '/article',
        className: 'article',
        render: function () {
            return $('#tpl_article').html();
        }
    }; 

    // course
    var course = {
        url: '/course',
        className: 'panel',
        render: function () {
            // alert(getQueryStringByName('id'));
            return $('#tpl_course').html();
        },
        bind: function () {       
            $('.pay_btn').on('click', function(){
              var id = getQueryStringByName('id');
              pay_h5(id);
            })
        }
    };

    // tabbar
    var tabbar = {
        url: '/home',
        className: 'tabbar',
        render: function () {
            var _t = this;
            setTimeout(function(){
              _t.bind()
            },100)
            return $('#tpl_tabbar').html();
        },
        bind: function () {       
          $('.course_list').html(all_courses_html);   
          $('.weui_tabbar_content').eq(0).show()
          $('.weui_tabbar_item').on('click', function () {
            $('.weui_tabbar_item').eq($('.weui_tabbar_item').index(this)).addClass('weui_bar_item_on').siblings().removeClass('weui_bar_item_on')
            $('.weui_tabbar_content').eq($('.weui_tabbar_item').index(this)).show().siblings().hide();
          });
        }
    };

    router.push(tabbar)
        .push(course)
        .setDefault('/home')
        .init();

    $.get('/jssdk', { url: location.href.split('#')[0] }, function(r){
      // process response
      console.log(r);
      console.log(r.appid);
      console.log(r.timestamp);
      console.log(r.nonceStr);
      console.log(r.signature);
      // 开始配置微信JS-SDK
      wx.config(r);
      // 调用微信API
  
      wx.ready(function () {
          wx.onMenuShareAppMessage({
              title: 'StuQ在线课程',
              desc: '我在StuQ学习在线课程，欢迎微信我',
              link: location.href.split('#')[0] ,
              imgUrl: 'http://stuq.mengxiaoban.cn/images/app-icon-stuq.png',
              trigger: function (res) {
                  // alert('用户点击发送给朋友');
              },
              success: function (res) {
                  // alert('已分享');
              },
              cancel: function (res) {
                  // alert('已取消');
              },
              fail: function (res) {
                  alert(JSON.stringify(res));
              }
          });

          wx.onMenuShareTimeline({
              title: '发货申请',
              link: location.href.split('#')[0] ,
              imgUrl: 'http://mengxiaoban.cn/images/logo.png',
              trigger: function (res) {
                  alert('不建议分享到朋友圈，建议定向发送，比如发送到好友，或qq好友');
              },
              success: function (res) {
                  alert('已分享');
              },
              cancel: function (res) {
                  alert('已取消');
              },
              fail: function (res) {
                  // alert(JSON.stringify(res));
              }
          });

          wx.onMenuShareQQ({
              title: '发货申请',
              desc: '我在呆萌小斑马创建了发货单，需要您发货，请帮忙填写发货信息，如不确定，微信我',
              link: location.href.split('#')[0] ,
              imgUrl: 'http://mengxiaoban.cn/images/logo.png',
              trigger: function (res) {
                  // alert('用户点击分享到QQ');
              },
              complete: function (res) {
                  // alert(JSON.stringify(res));
              },
              success: function (res) {
                  alert('已分享');
              },
              cancel: function (res) {
                  alert('已取消');
              },
              fail: function (res) {
                  // alert(JSON.stringify(res));
              }
          });
      });
    })


    function _get_date_string () {
      var date = moment().format('YYYY MM DD HH mm ss');

      return date.split(' ').join('_');
    }

    function _get_out_trade_no () {
      return _get_date_string ()  + "" + Math.random().toString().substr(2, 10);
    }
    
    function pay_h5(course_id){
      var ordor_id = _get_out_trade_no ();
      console.log(course_id)
      console.log(ordor_id)
      $.get('/pay?id=' + course_id + '&order_id=' + ordor_id + '&body=1111&detail=222222&fee=1&cb_url=/pay/pay_calllback/'+ ordor_id, function(data){
        var r = data.data;

        WeixinJSBridge.invoke('getBrandWCPayRequest', r, function(res){
          if(res.err_msg == "get_brand_wcpay_request:ok"){
            alert("支付成功");
            // 这里可以跳转到订单完成页面向用户展示
          }else{
            alert("支付失败，请重试");
          }
        });
      });
    }
    // .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
    // 相关 issue: https://github.com/weui/weui/issues/15
    // 解决方法:
    // 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
    // 1. 参考 http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
    //    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
    if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
    }
});