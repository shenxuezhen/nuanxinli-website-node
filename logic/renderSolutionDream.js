/**
 * Created by Administrator on 2016/10/29.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
var paging = require('../lib/paging');
function renderSolutionDream(cacheIndex, response,pageNumber,Cookies){
    var wrap = {},
        step,
        html;
    step=new Step(2,function(){
        //渲染最终结果
        html = viewManager.view("solutionDream" + cacheIndex).handle(wrap);
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
        data.INDEX='2';
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
                data.INDEX='2';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }else if(response.statusCode == 401){
                var data={};
                data.YES='no';
                data.INDEX='2';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }
            step.over();
        });

    }
    if(sid!=undefined){
        //解梦列表
        HTTP.get({
            url: environment.api.host.concat("public/dream-service/square-list?pageNum="+pageNumber+"&pageSize=10"),
            headers: {
                "Cookie": "sid="+sid
            }
        }, function (error, response, body) {
            var data = JSON.parse(body).list;
            var pageCount=JSON.parse(body).pager.pageCount;
            solutionDreamHandle = viewManager.view("solutionDream/content").handle;
            solutionDreamPagePagingHandle = paging(pageNumber, 10, pageCount,'solutionDream');
            if (!error && response.statusCode == 200) {
                wrap.solutionDream = solutionDreamHandle(data.slice(0, 4));
                wrap.paging = solutionDreamPagePagingHandle;
            }
            step.over();
        });
    }else{
        //请求us梦列表
        HTTP.get({
            url: environment.api.host.concat("public/dream-service/square-list?pageNum="+pageNumber+"&pageSize=10")
        }, function (error, response, body) {
            var data = JSON.parse(body).list;
            var pageCount=JSON.parse(body).pager.pageCount;
            solutionDreamHandle = viewManager.view("solutionDream/content").handle;
            solutionDreamPagePagingHandle = paging(pageNumber, 10, pageCount,'solutionDream');
            if (!error && response.statusCode == 200) {
                wrap.solutionDream = solutionDreamHandle(data.slice(0, 4));
                wrap.paging = solutionDreamPagePagingHandle;
            }
            step.over();
        });
    }
    return html;
}
module.exports=renderSolutionDream;