/*
    路由入口
    顶层拦截器
*/
var home = require("./home");

module.exports = function(app){
    
    app.use("/", home);

    /**
     * 没有匹配的路由，抛出404错误
     */
    app.use(function(req, res, next) {
        var err = new Error('Page Not Found!');
        err.status = 404;
        next(err);
    });
};




