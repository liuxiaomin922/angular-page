# angular-page
angular单页面打包方案
使用方法：

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
