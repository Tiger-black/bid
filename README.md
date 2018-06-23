# 一览科技-前端FED工具

* web开发工程化工具
* init 初始化项目
* dev 启动本地服务器
* update 更新项目下node_modules
* build 打包工程目录src/p中所有html、index.js文件 到 build目录中
安装及初始化工程

* 依赖及模块安装
    1. 确保本机已经正常安装了NodeJS，以及npm可以正常使用。
        * 安装方法请见：NodeJS官网
    2. 全局安装bud工具及构建依赖
        * sudo npm install br-bud -g 
        * **sudo npm install gulp webpack -g **
* 初始化工程
    1. 创建并进入新的工程目录 **mkdir myNewProject && cd myNewProject **
    2. 使用bud命令初始化工程目录 bud init
        * bud init会自动在为当前目录安装相关依赖，如果安装依赖时出现问题，请移除工程目录下的node_modules文件夹，并使用bud update命令手动进行安装。update命令具体使用方法请看下文。
* 启动本地服务
    1. 启动本地开发环境： bud dev ||  bud dev -p xxxx
     * 不使用参数 -p 时使用默认端口 3333 

* 依赖更新
    1. bud update 
     * 更新当前工程中相关依赖node_module(当build出现依赖问题时，可尝试对依赖进行更新后重试)

* 编译打包
    1. bud build 
     * 别民 bud p
     * 进行本地编译打包

    
    
        