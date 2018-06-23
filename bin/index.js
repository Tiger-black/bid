#!/usr/bin/env node
/*
 * @Author: xiaohu 
 * @Date: 2018-06-21 12:00:35 
 * @Last Modified by: xiaohu.li
 * @Last Modified time: 2018-06-23 14:49:51
 */

require('shelljs/global');//nodejs中使用shelljs模块的exec方法执行shell脚本命令
const fs = require('fs');
const path = require('path');
const co = require('co');//Generator 自驱动的流程处理库
const program = require('commander')//命令行处理框架
const thunkify = require('thunkify');//将多参数函数替换成单参数函数的转换器
const colors = require('cli-color');//改变控制台输出文本的颜色、文本格式化。
const inquirer = require('inquirer');//可嵌入式的命令行交互界面
const utils = require('../lib/utils');
const webServer = require('./../lib/server');

const appInfo = require('./../package.json');
const gitTools = utils.git;

const execThunk = thunkify(exec);

const LOGO = colors.xterm(20).bgXterm(226);
const USERCONFIG = utils.getUserConfig;
const BUILDINFOS = utils.getBuildInfo(USERCONFIG.version);

var setConfigVersion = thunkify(function(version, callback) {
	var branch = version ? version : false;
	gitTools.setConfigVersionThunk(branch, function(err, config) {
		return callback(err, config);
	});
});





program
	.allowUnknownOption() //不报错误
	.version(appInfo.version)
	.usage('FEDTools前端开发工具')
	.option('-q, --quiet', '安静模式')
	.option('-r, --react', '初始化react工程')
	.action(function() {
		console.log(LOGO(' _____ _____ ____ _____           _     '));
		console.log(LOGO('|  ___| ____|  _ \\_   _|__   ___ | |___ '));
		console.log(LOGO('| |_  |  _| | | | || |/ _ \\ / _ \\| / __|'));
		console.log(LOGO('|  _| | |___| |_| || | (_) | (_) | \\__ \\'));
		console.log(LOGO('|_|   |_____|____/ |_|\\___/ \\___/|_|___/'));
	})
	.parse(process.argv);

program
	.command('dev')
	.alias('d')
	.description('进行开发')
	.option('-p, --port [type]', '监听端口', '3333')
	.action(function(cmd, options) {
		console.log(colors.green('开启开发者模式'));
		webServer.start({
			port: program.args[0].port,
			queit: program.quiet
		});

		gitTools.setConfigVersion(); // 检测git分支，设置config.version

	}).on('--help', function() {
		console.log('  举个栗子:');
		console.log('');
		console.log('    bid dev,开启本地开发者模式');
		console.log('    bid dev -p|--port [端口号]   :   指定端口号');
		console.log('');
		process.exit(1);
	});

program
	.command('init')
	.alias('i')
	.description('初始化工程目录')
	.action(function(cmd, options) {
        console.log(colors.green('正在初始化工程目录ing...'));
        var dirname = path.join(process.cwd(), './');//当前目录
        utils.fileGenerator.projectGenerator({
			'dirname': dirname,
			'react': program.react
		}, function() { // 初始化常规工程
			console.log(colors.blue('正在安装工程构建所需要的依赖模块...'));
            var initTime = new Date().getTime();
			utils.fileGenerator.dependenciesGenerator({ // 复制依赖文件Node_modules
				'dirname': dirname
			}, function(error) {
				var nowTime = new Date().getTime();
				if (!error) {
					console.log(colors.green('依赖文件拷贝完成!'), colors.blue('共耗时:' + (nowTime - initTime) / 1000, 's'));
				} else {
					console.log(colors.red('拷贝依赖文件失败!'), colors.blue('共耗时:' + (nowTime - initTime) / 1000, 's'));
					console.log(colors.red(error));
				}
			});
		});
    }).on('--help', function() {
		console.log('  举个栗子:');
		console.log('');
		console.log('    bid init     ,   在当前路径下初始化[通用]工程目录');
		console.log('');
		process.exit(1);
    });
    

program
	.command('build')
	.alias('p')
	.description('进行构建')
	.action(function(cmd, options) {
		var deployJSON = null; // build.json源
		var isPublish = false; // 是否构建后调用发布接口
		var configure = {}; // 读取自本地工程config.json配置

		co(function*() {
			try {
				configure = yield setConfigVersion(false); // 检测git分支，设置config.version，并返回新的分支
			} catch (e) {
				console.log(colors.red('警告：当前不是git开发环境！'))
			}
			inquirer.prompt([{
				type: 'input',
				name: 'username',
				message: '请输入您的用户名:'
			}, {
				type: 'list',
				name: 'env',
				message: '请选择发布环境:',
				choices: [{
						name: '本地构建（相对路径构建，同时构建发布js、html）',
						value: 'dev'
					},{
						name: '日常发布（相对路径构建，同时构建发布js、html）',
						value: 'daily'
					}, {
						name: '线上发布（相对路径构建，同时构建发布js、html）',
						value: 'production'
					}] //['本地生成部署配置', '日常环境', '预发环境', '线上环境']
			}, {
				type: 'checkbox',
				name: 'selectedEntry',
				message: '请选择需要进行构建的页面:',
				choices: BUILDINFOS.autoGetHtml.keys
			}]).then(function(answers) {
				deployJSON = answers;
				deployJSON.htmlEntry = [];
				deployJSON.jsEntry = {};
				deployJSON.appName = configure.appName; // 应用名
				deployJSON.remotes = configure.remotes; // Git远端地址
				deployJSON.version = configure.version; // Git分支版本
				deployJSON.publish = configure.publish; // 发布配置信息
				deployJSON.cdnhost = configure.cdnhost; // 静态资源cdn域名


				answers.selectedEntry.forEach(function(se, index) { // 生成发布列表，构建列表
					for (var htmlKey in BUILDINFOS.autoGetHtml.jsEntry) {
						console.log(htmlKey)
						if (htmlKey.split(se).length > 1) {
							var tmpSrc = './' + htmlKey + '.html';
							if (configure.version) {
								tmpSrc = tmpSrc.replace(configure.version + '/', '');
							}
							if (BUILDINFOS.autoGetHtml.jsEntry[htmlKey]) {
								deployJSON.jsEntry[htmlKey] = BUILDINFOS.autoGetHtml.jsEntry[htmlKey];
							}
							deployJSON.htmlEntry.push(tmpSrc);
							break;
						}
					}
				});
				// console.log(deployJSON)
				return deployJSON;
			}).then(function(data) {
				if (data.selectedEntry.length == 0) {
					return console.log(colors.red('没有选择任何页面,构建结束'));
				}
				co(function*() {
					var filename = path.join(utils.path.cwdPath, 'build.json');
					
					var jsonData = JSON.stringify(data);
					try {
						fs.writeFileSync(filename, jsonData);
						console.log(colors.green('build.json创建成功'));
					} catch (err) {
						console.log(colors.red('build.json写入失败，请检查该文件'));
						console.log(colors.red(JSON.stringify(err)));
					}

					try {
						console.log('gulp deploy --entry ' + filename + ' --env daily')
						yield execThunk('gulp deploy --entry ' + filename + ' --env daily'); // 在本地进行build
					} catch (e) {
						console.log(colors.red('本地线上构建失败！'));
						console.log(e);
					}

					var chmod777 = function(callback) {
						var start777 = new Date().getTime();
						exec('chmod -R 777 ./deploy', {
							async: true,
							silent: program.quiet
						}, function(code, output) {
							var end777 = new Date().getTime();
							console.log(colors.green('修改build权限777完成，共耗时:' + (end777 - start777) / 1000, 's'));
							// chmod777();
						});
					}

					chmod777();
					// callbackFn = function(userName) {
					// 	if (userName) { // 校验用户名
					// 		var serverType = '默认';
					// 		var doPublish = function(confArr) {
					// 			var scpStartTime = new Date().getTime();
					// 			// exec('scp -r ./build root@101.200.132.102:/home', {
					// 			// exec('scp -r ./build/ ' + userName + '@192.168.180.10:/opt/www/minions', {
					// 			// 由于服务器端免密钥或交互式shell需要运维配合，开发成本较高，必所以暂时使用手工创建日常服务器项目目录的办法；
					// 			// 日常发布时，须保证服务器上已经存在项目文件夹，否则需要手动新建，并将owner设置为www,权限777,否则可能会影响日常发布
					// 			// console.log('scp -r ./build/* ' + userName + '@' + publishHost + ':' + publishPath + USERCONFIG.appName)
					// 			var $path = confArr.path;
					// 			confArr.host.forEach(function(host) {
					// 				var scpCmd = 'scp -r ./deploy/build/* ' + userName + '@' + host + ':' + $path + USERCONFIG.appName
					// 				console.log(scpCmd);
					// 				exec(scpCmd, {
					// 					async: true
					// 				}, function(code, output) {
					// 					var nowTime = new Date().getTime();
					// 					console.log(colors.green('已成功上传到 [' + serverType + ']（' + host + '） 服务器!'));
					// 					console.log(colors.blue('上传耗时:' + (nowTime - scpStartTime) / 1000, 's'));
					// 				});
					// 			});
					// 		}
					// 		try {
					// 			if (data.env === 'daily') { // 发布日常
					// 				serverType = '日常';
					// 				doPublish(USERCONFIG.publish.daily)
					// 			} else if (data.env === 'pre') { // 发布预发阿里云
					// 				serverType = '预发';
					// 				doPublish(USERCONFIG.publish.pre)
					// 			} else if (data.env === 'production') { // 发布线上阿里云
					// 				serverType = '线上';
					// 				doPublish(USERCONFIG.publish.production);
					// 			} else {
					// 				colors.yellow('发布未成功，因为您没有指定正确的发布环境');
					// 			}
					// 		} catch (e) {
					// 			console.log(colors.red('config.json发布配置错误，' + serverType + '发布失败'));
					// 			console.log(colors.red(e));
					// 		}
					// 	} else {
					// 		console.log(colors.red('上传失败，无法解析您输入的userName'));
					// 	}
					// }
					// callbackFn(data.username);
					// console.log(colors.green('构建完毕!'));
				});
			});
		});
	}).on('--help', function() {
		console.log('  举个栗子:');
		console.log('');
		console.log('bid deploy');
		console.log('');
		process.exit(1);
	});


program
	.command('update')
	.alias('u')
	.description('更新工程构建所需要的依赖模块')
	.action(function(cmd, options) {
		console.log(colors.blue('开始更新工程构建所需要的依赖模块...'));
		var initTime = new Date().getTime();
		var dirname = path.join(process.cwd(), './');
		utils.fileGenerator.dependenciesGenerator({ // 复制依赖文件Node_modules
			'dirname': dirname
		}, function(error) {
			var nowTime = new Date().getTime();
			if (!error) {
				console.log(colors.green('依赖更新完成!'), colors.blue('共耗时:' + (nowTime - initTime) / 1000, 's'));
			} else {
				console.log(colors.red('拷贝依赖文件失败!'), colors.blue('共耗时:' + (nowTime - initTime) / 1000, 's'));
				console.log(colors.red(error));
			}
		});

	}).on('--help', function() {
		console.log('  举个栗子:');
		console.log('');
		console.log('    bid update  (-q|--quiet) ,   更新bid全局依赖模块(开启安静模式，默认"非安静模式")');
		console.log('    bid update -f [模块名],   强制重新安装bid指定依赖模块');
		console.log('');
		process.exit(1);
	});




program
	.command('help')
	.alias('h')
	.description('帮助')
	.action(function(cmd, options) {
        console.log('初始化 bud init');
        console.log('启服务 bud dev 改端口号 -pxxxx');
        console.log('构建 bud build');
    })


program.parse(process.argv);