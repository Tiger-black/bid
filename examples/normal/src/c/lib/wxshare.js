require('@br/lib/zepto.min');
var Toast = require('@br/common/toast/');
var Autograph = require('@br/lib/autograph');


var SHARE_URL = window.location.href.split('#')[0];
var CONFIG_API = 'https://howto.yilan.tv/user/wechat';
var TOAST_TIME = 2000;

function WXShare() {
    this.init.apply(this, arguments);
}

$.extend(WXShare.prototype, {
    init: function (config) {
        if (window.wx) {
            this.date = new Date() *1;
            var data =  {
                url: SHARE_URL,
                app:'howto_h5',
                app_name:'howto',
                appid:'yilanh5',
                timestamp:this.date,
            };
            this.getsign = Autograph(data);
            this.getToken(); //页面分享
            this.events();
        } else {
            console.log('非微信环境');
        }

    },

    events: function () {
        var self = this;
        wx.error(function (res) {
            //alert(JSON.stringify(res));
        });

    },

    getToken: function () {
        var self = this;
        $.ajax({
            url: CONFIG_API,
            data: {
                url: SHARE_URL,
                app:'howto_h5',
                app_name:'howto',
                appid:'yilanh5',
                timestamp:this.date,
                sign:this.getsign,
            },
            type: 'get',
            dataType: 'jsonp',
            success: function (data) {
                // console.log(data)
                if (data.retcode == 200) {
                    self.wxConfig(data.data);
                } else {
                    //new Toast('位置错误:' + data.code, TOAST_TIME);
                }
            },
            error: function () {
                console.log('error');
            }
        });
    },

    wxConfig: function (data) {
        // console.log(data)
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: Number(data.timestamp),
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareQZone',
                'onMenuShareWeibo'
            ]
        });
    },

    bindShare: function (config) {
        var _data = {
            link: SHARE_URL, // 分享链接
            title: config.title, // 分享标题
            desc: config.desc, // 分享描述
            imgUrl: config.imgUrl, // 分享图标
            success: function (res) {
                new Toast('分享成功', TOAST_TIME);
            },
            cancel: function (res) {
                new Toast('取消了分享', TOAST_TIME);
            }
        };
        wx.ready(function () {
            wx.onMenuShareAppMessage(_data); //分享给朋友
            wx.onMenuShareTimeline(_data);  //分享到朋友圈
            wx.onMenuShareQQ(_data); //分享到QQ
            wx.onMenuShareQZone(_data);//分享到QQ空间
            wx.onMenuShareWeibo(_data); //分享到微博
        });
    }
});

module.exports = WXShare;