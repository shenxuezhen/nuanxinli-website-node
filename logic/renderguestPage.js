/**
 * Created by Administrator on 2016/4/14.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
var paging = require('../lib/paging');
function renderguestPage( cacheIndex, response,pageNumber,cookies,username) {
    var wrap = {},
        step,
        html;
    var sid=cookies.sid;
    step = new Step(4,function () {
        //渲染最终结果
        html = viewManager.view("guestPage" + cacheIndex).handle(wrap);
        // 缓存
        // global.cache.put(cacheIndex, html);
        //响应
        response.send(html);
    });
    //显示登录或用户信息
    if(sid==undefined){
        var data={};
        data.YES='no';
        data.INDEX="0";
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
                data.INDEX="0";
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }else if(response.statusCode == 401){
                var data={};
                data.YES='no';
                data.INDEX="0";
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }
            step.over();
        });
    }
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

    //请求用户数据
    HTTP.get({
        url: environment.api.host.concat("public/user/info/"+username),
    }, function (error, response, body) {

        var data = JSON.parse(body),
            personalHandle = viewManager.view("guestPage/guestMassage").handle;
        if (!error && response.statusCode == 200) {
            wrap.personalMassage = personalHandle(data);
        }
        step.over();
    });
    //请求帖子数据
    HTTP.get({
        url: environment.api.host.concat("public/bbs-post/user-list/for-website?username="+username+"&pageNum="+pageNumber+"&pageSize=10"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {
        console.log("**************************");
        console.log("response body : %s", body);
        var data = JSON.parse(body).list;
        var data2=JSON.parse(body).pager;
        var pageCount=JSON.parse(body).pager.pageCount;
        personalPostHandle = viewManager.view("guestPage/guestPost").handle;
        tabHandle = viewManager.view("guestPage/tab").handle;
        personalPagingHandle = paging(pageNumber, 10, pageCount,"personalPage");
        if (!error && response.statusCode == 200) {
            wrap.personalPost = personalPostHandle(data.slice(0, 10));
            wrap.tab = tabHandle(data2);
            if(pageCount>1){
                wrap.paging=personalPagingHandle;
            }
        }
        step.over();
    });
    return html;
}
module.exports = renderguestPage;