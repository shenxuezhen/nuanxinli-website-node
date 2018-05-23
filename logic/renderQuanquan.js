/**
 * Created by Administrator on 2016/4/14.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
var paging = require('../lib/paging');
var dataConversion = require('../lib/dataConversion');
function renderQuanquan( cacheIndex, response,pageNumber,heartKind,cookies) {
    var wrap = {},
        step,
        html;
    var sid=cookies.sid;
    step = new Step(4, function () {
        //渲染最终结果
        html = viewManager.view("quanquan" + cacheIndex).handle(wrap);
        ////缓存
        //global.cache.put(cacheIndex, html);
        //响应
        response.send(html);
    });
    //显示登录或用户信息
    if(sid==undefined){
        var data={};
        data.YES='no';
        data.INDEX='3';
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
                data.INDEX='3';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }else if(response.statusCode == 401){
                var data={};
                data.YES='no';
                data.INDEX='3';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }
            step.over();
        });
    }
    //请求心理种类
    HTTP.get({
        url: environment.api.host.concat("public/bbs-part/list")
    },function(error, response, body){
        var data=JSON.parse(body);
        console.log("############## %s", body);
        quanquanHandle = viewManager.view("quanquan/HeartProblem").handle;
        if (!error && response.statusCode == 200) {
            wrap.kinds = quanquanHandle(data.slice(0, 8));
        }
        step.over();
    });
    //请求杂志数据
    HTTP.get({
        url: environment.api.host.concat("public/sift/today-list")
    }, function (error, response, body) {
        var data = JSON.parse(body);
        dataConversion(data);
        magazineDataHandle = viewManager.view("home/magaine_data").handle;
        magazineHandle = viewManager.view("home/magazine").handle;
        if (!error && response.statusCode == 200) {
            console.log("data[0]:"+JSON.stringify(data[4]));
            wrap.magazineData = magazineDataHandle(data[4]);
            console.log("wrap.magazineData:"+wrap.magazineData);
            wrap.magazine = magazineHandle(data.slice(0, 5));
        }
        step.over();
    });
    if(sid!=undefined){
        //heartKind：url的参数kind的值
        if(heartKind=="all"){
            //请求全部的圈圈数据
            HTTP.get({
                url: environment.api.host.concat("public/bbs-post/list/for-website?pageNum="+pageNumber+"&pageSize=10"),
                headers: {
                    "Cookie": "sid="+sid
                }
            }, function (error, response, body) {
                var data = JSON.parse(body).list;
                var pageCount=JSON.parse(body).pager.pageCount;
                quanquanHandle = viewManager.view("quanquan/quanquan_content").handle;
                quanquanPagingHandle = paging(pageNumber, 10, pageCount,"quanquan","all");
                if (!error && response.statusCode == 200) {
                    wrap.quanquan = quanquanHandle(data.slice(0, 10));
                    wrap.paging=quanquanPagingHandle;
                }
                step.over();
            });
        }else{
            //请求不同类型的圈圈数据
            HTTP.get({
                url: environment.api.host.concat("public/bbs-post/list/for-website?type="+heartKind+"&pageNum="+pageNumber+"&pageSize=10"),
                headers: {
                    "Cookie": "sid="+sid
                }
            }, function (error, response, body) {
                var data = JSON.parse(body).list;
                var pageCount=JSON.parse(body).pager.pageCount;
                quanquanHandle = viewManager.view("quanquan/quanquan_content").handle;
                quanquanPagingHandle = paging(pageNumber, 10, pageCount,"quanquan",heartKind);
                if (!error && response.statusCode == 200) {
                    wrap.quanquan = quanquanHandle(data.slice(0, 10));
                    wrap.paging=quanquanPagingHandle;
                }
                step.over();
            });
        }
    }
    else{
        if(heartKind=="all"){
            //请求全部的圈圈数据
            HTTP.get({
                url: environment.api.host.concat("public/bbs-post/list/for-website?pageNum="+pageNumber+"&pageSize=10")
            }, function (error, response, body) {
                var data = JSON.parse(body).list;
                var pageCount=JSON.parse(body).pager.pageCount;
                quanquanHandle = viewManager.view("quanquan/quanquan_content").handle;
                quanquanPagingHandle = paging(pageNumber, 10, pageCount,"quanquan","all");
                if (!error && response.statusCode == 200) {
                    wrap.quanquan = quanquanHandle(data.slice(0, 10));
                    wrap.paging=quanquanPagingHandle;
                }
                step.over();
            });
        }else{
            //请求不同类型的圈圈数据
            HTTP.get({
                url: environment.api.host.concat("public/bbs-post/list/for-website?type="+heartKind+"&pageNum="+pageNumber+"&pageSize=10")
            }, function (error, response, body) {
                var data = JSON.parse(body).list;
                var pageCount=JSON.parse(body).pager.pageCount;
                quanquanHandle = viewManager.view("quanquan/quanquan_content").handle;
                quanquanPagingHandle = paging(pageNumber, 10, pageCount,"quanquan",heartKind);
                if (!error && response.statusCode == 200) {
                    wrap.quanquan = quanquanHandle(data.slice(0, 10));
                    wrap.paging=quanquanPagingHandle;
                }
                step.over();
            });
        }
    }

    return html;
}
module.exports = renderQuanquan;