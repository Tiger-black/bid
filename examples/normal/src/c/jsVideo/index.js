
require('@br/lib/zepto.min');
require('./index.less');
var enableInlineVideo = require('iphone-inline-video');
var tpl = require('./index.ejs');
var API_getVideo = window.location.protocol + '//howto.yilan.tv/video/play';

function SpList() {
    this.init.apply(this, arguments);
}

$.extend(SpList.prototype, {
    init: function (config) {
        this.el = config.el;
        this.data = config.data;
        this.render();
        this.events();
    },
    render: function () {
        var _html = tpl(this.data);
        this.el.html(_html);
    },
    events(){
        var self = this;
        $('.js-video').on('tap',function(){
            var _this = $(this);
            var video = $(this).find('video');
            var playPause = $(this).find('.playPause');
            if(!_this.hasClass('play')){
                _this.addClass('play');
                playPause.hide();
                video[0].play();
            }else{
                console.log(22)
                _this.removeClass('play');
                video[0].pause();
                playPause.show();
            }
        });

        $('.video video').map((i,element) => {
            enableInlineVideo(element, {everywhere: ''});
        })
    },
    pause(num){
        $('.video video').forEach((element,i) => {
            if(i != num){
                element.pause();
                element.parentNode.classList.remove('play');
                element.nextElementSibling.style.display='block';
            };
        })
    }
});


module.exports = SpList;








