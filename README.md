# angular-page
angular单页面打包方案
使用方法：

一、安装

1、需要在本机 先安装node和gulp

node官网 http://nodejs.cn/ 请安装稳定版
gulp安装 ：

     （1）在命令行输入：npm install -g gulp  #全局安装
     （2）切换到项目目录命令行输入：npm install gulp --save-dev # 局部安装
2、node 和gulp都安装完毕后

      在命令行输入 ：npm install #安装gulp插件
      
3、如果一切正常下面可以开始使用了，介绍下命令

    （1） 在命令行输入 ：gulp #打包生成 devbuild（本地开发包）和productbuild（上线包），本地测试devbuild即可，上线用productbuild包
             devbuild和productbuild区别在于前者没有将js和css、html进行压缩，只是进行了同步依赖的合并，同时前者没有为js何css加入防止缓存的随机字符串
             
    （2）在命令行输入：gulp d #单独打包生成devbuild包
    
    （3）在命令行输入：gulp p #单独打包生成productbuild包
    （3）在命令行输入：gulp watch #监视静态文件和html的变化并实时打包输出到devbuild和productbuild（可以监听js(不包括公共库lib),css,html,img的增删改）
    （4）在命令行输入：gulp app #单独打包devbuild 的js文件（相同任务还有：css、lib、htmlmin、imagemin，分别对应单独打包css文件，公共依赖的库文件、压缩html模板、压缩图片）
    （5）在命令行输入：gulp p-app #单独打包productbuild 的js文件（相同任务还有：p-css、p-lib、p-htmlmin、p-imagemin，p-preventCook分别对应单独打包css文件，公共依赖的库文件、压缩html模板、压缩图片、和防止缓存重命名js和css加入随机字符串如：main-3332c03bdc.css）

说明：在平时工作 首先需要运行 gulp，打包生成最新的开发包和上线包，然后开启命令 gulp watch即可，devbuild包不需要上传到svn，同时需要把本地搭建的服务器根目录指向 "devbuild/",默认首页为 index.html

二、使用

下面以 /static/js/module/controller 为例，讲解如何具体使用框架 angular单页框架

这套项目使用了angular-route 来控制路由

比如你要添加一个other的页面，访问地址是: /other

 <1> 需要在 /static/js/app.js 里面添加一条路由配置
 
     .when('/other', {
                    controller: 'pageCtr', #需要在/static/js/module/controller 路径下增加，           page.js（文件名称可以随便起，因为最后都要打包成一个js，但是为了方便开发，文件名建议和控制器名称一致）
                    templateUrl: '/tpl/page2.html' #需要在/static/view/tpl 路径下增加 page2.html （文件名也最好有一定规律）
                })
 <2> 需要在/static/js/module/controller 路径下增加page.js
 
     var app=require("./indexApp");
     var lxm=require("../../common/page") #这是调用/static/js/common 目录下公共js组件的方法
     app.controller("pageCtr",['$scope',function($scope){  #控制器的名称一定要和/static/js/app.js 里面配置的controller 名称一样
          $scope.aa="/111.png";
          $scope.aaa="/index/111.png";
          lxm()
     }]);
     
 <3> 需要在/static/view/tpl 路径下增加 page2.html
 
 <4> 需要在/static/js/module/controller/indexApp.js 里面增加一行
 
     require("./page") #这样在打包依赖的时候就可以找到page.js，将其合并到一个js里面
     
最后就可以在/static/js/module/controller/page.js 里面尽情开发所需业务
相应的html模版就是/static/view/tpl/page2.html 

如何再增加更多的页面，道理是一样的重复以上4步
