/*
    视图管理模块，直接从内存中加载视图
*/
var fs = require('fs'),
    viewMap = {};
var hbs = require('hbs');
var log = require("../lib/log").logger("user");

//模版引擎助手
hbs.registerHelper("addOne",function(index){
  //返回+1之后的结果
  return index+1;
});

/*
    递归目录下的所有文件
    path  路径，相对于应用根目录的路径
    fileList 文件列表
*/
function walk(path, fileList){
  var dirList = fs.readdirSync(path);
  dirList.forEach(function(item){
    if(fs.statSync(path + '/' + item).isDirectory()){
      walk(path + '/' + item, fileList);
    }else{
      fileList.push(path + '/' + item);
    }
  });
}

/*
    初始化视图管理
*/
exports.load = function(){
    var fileList = [],
        html = "",
        i;
    
    //获取所有视图文件路径
    walk('views', fileList);
    
    //读取视图文件内容
    for(i = 0; i < fileList.length; i++){
        html = fs.readFileSync(fileList[i],"utf-8");
        viewMap[fileList[i].replace(/\.[^.]+?$/, "").replace(new RegExp("^[^/]+?/"), "")] = {
            plain: html,
            handle: hbs.compile(html)
        };
    }
}

/*
    获取视图内容
*/
exports.view = function(path){
    return viewMap[path];
}

