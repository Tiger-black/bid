var $ = require('zepto');
var Index = require('@br/test/index');
new Index({
	el: $('h2')
});
console.log($('h2'));
