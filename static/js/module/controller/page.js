/**
 * Created by lxm on 16/2/25.
 */
var app=require("./indexApp");
var lxm=require("../../common/page")
app.controller("pageCtr",['$scope',function($scope){
    $scope.aa="/111.png";
    $scope.aaa="/index/111.png";
    lxm()
    var version= Date.parse(new Date());
}]);