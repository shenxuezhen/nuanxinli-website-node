/**
 * Created by Administrator on 2016/4/13.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var HTTP = require('request');
var compare=require("../lib/compare");
 //请求我的数据
function isLogin(Cookies){
    var wrap = {};
    var sid=Cookies.sid;

}

module.exports = isLogin;