/*
 * @Author: xiaohu 
 * @Date: 2018-06-21 11:57:41 
 * @Last Modified by:   xiaohu.li 
 * @Last Modified time: 2018-06-21 11:57:41 
 */
var fs = require('fs');
var path = require('path');
var utils = require('../utils');
var style = '';
var rem = '';
style = fs.readFileSync(path.resolve(utils.path.rootPath, './lib/server/body_style.css'), 'utf-8');
rem = fs.readFileSync(path.resolve(utils.path.rootPath, './examples/normal/src/c/common/rem.js'), 'utf-8');

var mata = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="black"/><meta name="format-detection" content="telephone=no"/>';

if (style) {
    style = mata + '<style>' + style + '</style>';
}
if (rem) {
    rem = '<script type="text/javascript">' + rem + '</script>'
    style += rem;
}

var FilterPath = [/^\./, /node_modules/];

function GetCatalog(req, res, next) {
    var _path = req.path;
    var _html = style + '<ul><li><a href="../">...</a></li>';
    var re = /.[a-zA-Z0-9_]+$/;
    if (!_path.match(re)) {//是文件夹就继续
        fs.readdir(path.join(utils.path.cwdPath, _path), (err, files) => {
            if (err) {
                console.log('readdir error')
                console.log(err)
                res.send(err);
            } else {
                var _files = FilterFilesArray(files, FilterPath);
                _files.forEach(function(item) {
                    var tmpPath = _path + item;
                    var itemType = 'file';
                    _html += '<li><a data-fileType="' + itemType + '" href="' + tmpPath + '">' + item + '</a></li>'
                });
                _html += '</ul>';
                console.log(_html)
                res.send(_html);
            }
        });
    } else {
        next();
    }
}

function FilterFilesArray(files, filters) {
    var _files = [];
    files.forEach((item) => {
        let needFilter = false;
        filters.forEach((filter) => {
            if (item.match(filter)) {
                needFilter = true;
            }
        })
        if (!needFilter) {
            _files.push(item);
        }
    });
    return _files;
}

module.exports = GetCatalog;