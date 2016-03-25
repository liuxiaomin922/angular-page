require("./module/controller/indexApp");
require("./module/directive/indexApp");
require("./module/filter/indexApp");
require("./module/service/indexApp");
require("./common/index");
angular.element(document).ready(function(){
    angular.module('app', [
            'ngRoute','appCtr','appDirective','appFilter','appService'
        ])
        .config(['$routeProvider',function ($routeProvider){
            $routeProvider
                .when('/', {
                    controller: 'indexCtr',
                    templateUrl: '/tpl/page.html'
                })
                .when('/other', {
                    controller: 'pageCtr',
                    templateUrl: '/tpl/page2.html'
                })
                .when('/404', {
                    controller: 'errorCtr',
                    templateUrl: '/tpl/404.html'
                })
                .otherwise({
                    redirectTo: '/404'
                });
        }]);
    angular.element(document).ready(function(){
        angular.bootstrap(document, ['app'])
    })
})
//最后手动启动

