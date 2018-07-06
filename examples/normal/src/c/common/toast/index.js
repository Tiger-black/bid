require('./index.less');
require('@br/lib/zepto.min');
var Tpl = require('./index.ejs');

function Toast() {
    this.init.apply(this, arguments);
}

Toast.prototype = {
    init: function (message, outTime) {
        var self = this;
        this.data = {
            message: message
        };
        this.outTime = outTime || 2000;
        if (window.BrBridge && window.BrBridge.env.isApp) {
            this.renderInApp();
        } else {
            if (this.el) {
                this.show();
            } else {
                this.render();
            }
            window.setTimeout(function () {
                self.close();
            }, this.outTime);
        }
    },

    render: function () {
        this.el = $(Tpl(this.data));
        $('body').append(this.el);
        this.el.eq(0).css({
            'height': this.el.eq(0).height() + 'px',
            'width': this.el.eq(0).find('p').width() + 'px',
            'padding-top': '0.4rem',
            'padding-bottom': '0.4rem',
            'top': 0,
            'bottom': 0
        });
    },

    renderInApp: function () {
        var self = this;
        BrBridge.call('Common', 'toast', {
            content: self.data.message,
            time: self.outTime
        }, function (data) {
            //console.log('Toast!');
        }, function (error) {
            console.error('Toast Error!', error);
        });
    },

    set: function (data) {
        this.close();
        this.init(data);
    },

    show: function () {
        this.el.show();
    },

    hide: function () {
        this.el.hide();
    },

    close: function () {
        var self = this;
        this.el.eq(0).animate({opacity: 0}, 400, 'ease-out', function () {
            self.el.remove();
        });
        //this.el.eq(1).animate({opacity: 0}, 400, 'ease-out', function () {});
    }

};

module.exports = Toast;