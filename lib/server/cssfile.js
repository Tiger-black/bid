/*
 * @Author: xiaohu 
 * @Date: 2018-06-21 11:55:47 
 * @Last Modified by: xiaohu.li
 * @Last Modified time: 2018-06-21 12:11:28
 */

var path = require('path');
var lessMiddleware = require("less-middleware");//less-middleware 当有css文件请求时，才去找到对应的less文件生成相应的css文件


module.exports = lessMiddleware(process.cwd(), {
    preprocess: {
        path: function (pathname, req) {
            var _path = pathname;
            if (_path.indexOf('/build') != -1) {
                _path = pathname.replace(/build/, 'src');
            }
            return _path
        }
    },
    //dest: path.join(process.cwd()),
    debug: true
});
