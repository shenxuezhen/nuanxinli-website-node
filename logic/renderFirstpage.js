var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');

function renderFirstpage( cacheIndex, response,Cookies) {
    var wrap = {},
        step,
        html;
    //var sid=cookies.sid;
    //console.log("%%%%%%%%%%%%%%%%%%%");
    //console.log(sid);
    step = new Step(4, function () {
        //渲染最终结果
        html = viewManager.view("home"+cacheIndex).handle(wrap);
        //缓存
        //global.cache.put(cacheIndex, html);
        //响应
        response.send(html);
    });
    //显示登录或用户信息
    var sid=Cookies.sid;
    if(sid==undefined){
        var data={};
        data.YES='no';
        data.INDEX='0';
        loginHandle = viewManager.view("home/header").handle;
        wrap.headerContent = loginHandle(data);
        step.over();
    }else{
        HTTP.get({
            url: environment.api.host.concat("public/user/info"),
            headers: {
                "Cookie": "sid="+sid
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                data.YES='yes';
                data.INDEX='0';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }else if(response.statusCode == 401){
                var data={};
                data.YES='no';
                data.INDEX='0';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }
            step.over();
        });
    }
    //请求咨询师列表
    HTTP.get({
        url: environment.api.host.concat("public/consultant/list/for-website?pageNum=1&pageSize=8")
    }, function (error, response, body) {
        var data = JSON.parse(body).list,
            counselorHandle = viewManager.view("home/counselor").handle;

        if (!error && response.statusCode == 200) {
            for(var i=0;i<data.length;i++){
                var str=data[i].consultant.specialty;
                data[i].consultant.specialty=str.replace(/(^\s\p{Zs})|(\s\p{Zs}$)/g, "");
            }
            wrap.counselorMaster = counselorHandle(data.slice(0, 4));
            wrap.counselorDirector = counselorHandle(data.slice(4, 8));
        }

        step.over();
    });

    //请求圈圈数据
    HTTP.get({
        url: environment.api.host.concat("public/bbs-post/list/for-website?pageNum=1&pageSize=4")
    }, function (error, response, body) {
        var data = JSON.parse(body).list,
            quanquanHandle = viewManager.view("home/quanquan").handle;

        if (!error && response.statusCode == 200) {
            wrap.quanquan = quanquanHandle(data.slice(0, 4));
        }

        step.over();
    });

    //请求杂志数据
    HTTP.get({
        url: environment.api.host.concat("public/sift/today-list")
    }, function (error, response, body) {
        var data = JSON.parse(body),
            magazineHandle = viewManager.view("home/magazine").handle;

        if (!error && response.statusCode == 200) {
            wrap.magazine = magazineHandle(data.slice(0, 5));
        }

        step.over();
    });

    return html;
}
module.exports = renderFirstpage;