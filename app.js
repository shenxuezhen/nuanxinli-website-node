var express = require('express');
var app = express();
//加载系统配置
var environment = require("./config/env.json");
//加载view管理模块
var viewManager = require("./lib/view_manager");
//加载缓存模块
var Cache = require("./lib/cache");
//加载hbs模块
var hbs = require('hbs');
//加载控制器模块
var router = require("./router/router")(app);
//加载日志组件
var log4js = require("./lib/log");
log4js.configure("worker");
app.use(log4js.useLog());
// 设定port变量，访问端口
app.set('port', environment.app.port);

// 设定views变量，意为视图存放的目录
app.set('views', __dirname.concat('/views'));

// 设定静态文件目录，比如本地文件
// 目录为demo/public/images，访问
// 网址则显示为http://localhost:3000/images
app.use(express.static(__dirname.concat('/public')));

// 指定模板文件的后缀名为html
app.set('view engine', 'html');
// 运行hbs模块
app.engine('html', hbs.__express);

/* 捕获中间件抛出的异常 */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


/* 启动工作进程 */
var server = app.listen(app.get("port"), function() {
    var log = log4js.logger("worker");
    log.info("start worker, pid is " + process.pid);
    
    //初始化视图
    viewManager.load();
    log.info("视图初始化完成");
    
    //初始化缓存，最大缓存15分钟
    global.cache = new Cache(15);
    log.info("缓存初始化完成");
});

/* 捕获全局异常，如果最终调入到了这里，要非常注意 */
process.on("uncaughtException", function(err) {
    var log = log4js.logger("worker_" + process.pid);
    log.error("Error caught in uncaughtException event:", err);
});


