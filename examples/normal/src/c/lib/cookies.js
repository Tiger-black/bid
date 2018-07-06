'use strict';

function Index() {}

Index.prototype = {
    getSeaaion:function(){
        var self = this;
        var arr,reg=new RegExp("(^| )USERSESSIONID=([^;]*)(;|$)");
        if(arr = document.cookie.match(reg)){
            return arr[2];
        }else{
            var USERSESSIONID = this.generateSession(22);
            var exp = new Date(); 
            exp.setTime(exp.getTime() + self.Days*24*60*60*1000); 
            document.cookie = 'USERSESSIONID' + "="+ USERSESSIONID + ";expires=" + exp.toGMTString()+";path=/;domain="+window.location.host;
            return USERSESSIONID
        }
    },
    generateSession(n){
        var words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var chars = nums.concat(words).concat(words.map(function (s) {
            return s.toLowerCase()
        }))
        var res = '';
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 61);
            res += chars[id];
        }
        return res;
    },
};

module.exports = Index;