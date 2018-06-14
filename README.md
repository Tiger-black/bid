# 一览科技-前端FED工具

* web开发工程化工具
* dev 启动本地服务器
* build 打包工程目录src/p中所有index.js文件 到 build目录中
安装及初始化工程

* 依赖及模块安装
    1. 确保本机已经正常安装了NodeJS，以及npm可以正常使用。
        * 安装方法请见：NodeJS官网
    2. 全局安装bid工具及构建依赖
        * sudo npm install br-bid -g 
        * **sudo npm install gulp webpack -g **
* 初始化工程
    1. 创建并进入新的工程目录 **mkdir myNewProject && cd myNewProject **
    2. 使用bid命令初始化工程目录 bid init
        * bid init会自动在为当前目录安装相关依赖，如果安装依赖时出现问题，请移除工程目录下的node_modules文件夹，并使用bid update命令手动进行安装。update命令具体使用方法请看下文。