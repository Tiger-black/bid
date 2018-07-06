
module.exports = {

    //是否是字符
    isString: function (str) {
        return typeof str === 'string';
    },

    // 是否为空
    isNull: function (value) {
        return (value === null || value === undefined || value === '');
    },

    //获取长度
    size: function (str) {
        return str.length;
    },

    //是否在范围内
    range: function (value, max, min) {
        var L = this.size(value);
        if (max != undefined && min != undefined) {
            return (max >= L && L >= min);
        } else if (min == undefined) {
            return L <= max;
        }
    },

    //去掉空格
    spaces: function (value) {
        var rex = new RegExp(/[/s]+/g);
        return value.replace(rex, '');
    },

    //验证手机
    isTel: function (Number) {
        // var rex = new RegExp(/^((15|13|17|18)[0-9]{1})+\d{8}$/g);
        var rex = new RegExp(/^[1][3-8][0-9]{9}$/g);
        return rex.test(Number);
    },

    //验证数字
    isNumber: function (num) {
        var rex = new RegExp(/^[0-9]{1,}$/g);
        return rex.test(num);
    },

    //验证密码,至少6位字符;
    isPassword: function (pw) {
        //var L = this.size(pw);
        // 匹配12位 英文 数字 下划线 ;
        var rex = new RegExp(/^[\w]{6,}$/g);
        return rex.test(pw);
    },
    isPass: function (pw) {
        //var L = this.size(pw);
        // 匹配12位 英文 数字 下划线 ;
        var rex = new RegExp(/^[0-9a-zA-z]{6,12}$/);
        return rex.test(pw);
    },

    //身份证
    isID: function (Number) {
        var rex = new RegExp(/(^\d{13}$)|(^\d{14}$)|(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
        return rex.test(Number);
    },

    //身份证18位
    iscardID: function (Number) {
        var rex = new RegExp(/(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
        return rex.test(Number);
    },

    //验证邮箱;
    isEmail: function (email) {
        var rex = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
        return rex.test(email);
    },

    //公司名称 支持中文字+字母+()
    isCompany: function (company) {
         var rex = new RegExp(/^[a-zA-Z0-9()（）\u4e00-\u9fa5]+$/g);
        // var rex=/^[\(\)\（\）\u4E00-\u9FA5-a-zA-Z]+$/
        return rex.test(company);
    },
    //中文名+点
    isNameEZ: function (isNameEZ) {
         var _isNameEZ=isNameEZ;
        _isNameEZ=_isNameEZ.replace(/\n*/g, '');
        var rex = /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$/;
        return rex.test(isNameEZ);
    },

    //中文名
    isName: function (name) {
        var rex = new RegExp(/^[\u2E80-\u9FFF]+$/g);
        return rex.test(name);
    },
    //住宅
    isAddress: function (Address) {
        var _Address=Address;
        _Address=_Address.replace(/\n*/g, '');
        var rex = /^[\u4e00-\u9fa5-a-zA-Z0-9]+$/;
        return rex.test(_Address);
    },

    //5字以上中文字+字母+() 公司名称、地址等
    isFiveAddress: function (Address) {
        var _Address=Address;
        _Address=_Address.replace(/\n*/g, '');
        var rex = /^[\u4e00-\u9fa5-a-zA-Z0-9]{5,}$/;
        return rex.test(_Address);
    },
    
    //例:010-88888888(3或4-7或8)
    isTelNum:function(TelNum) {
        // var rex =/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
        var rex=/^\d{3,4}-?\d{7,8}$/;
        return rex.test(TelNum);
    },
    //16位或19位银行卡号
    isAccount: function(Account){
        var _Account = Account;
        if (Account.indexOf(' ') != -1) {
            _Account = _Account.replace(/\s*/g, '');
        }
        // var rex = /^[0-9]\d{15}|[0-9]\d{18}/;
        var rex=/^(\d{16}|\d{19})$/;
        return rex.test(_Account);
    }

};