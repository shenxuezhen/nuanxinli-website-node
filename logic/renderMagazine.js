/**
 * Created by Administrator on 2016/4/14.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
var paging = require('../lib/paging');
var deleteP = require('../lib/deleteP');
var dataConversion = require('../lib/dataConversion');
var cheerio = require('cheerio');
function renderMagazine( cacheIndex, response,pageNumber,cookies) {
    var wrap = {},
        step,
        html;
    step = new Step(2, function () {
        //渲染最终结果
//        console.log("%s", "viewManager:", "magazine" + cacheIndex);
        html = viewManager.view("magazine" + cacheIndex).handle(wrap);
        //缓存
        //global.cache.put(cacheIndex, html);
        //响应
        response.send(html);
    });
    //显示登录或用户信息
    var sid=cookies.sid;
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
        //用户已登录
        //请求my杂志数据
        HTTP.get({
            url: environment.api.host.concat("public/sift/my-list/for-website?pageNum="+pageNumber+"&pageSize=10"),
            headers: {
                "Cookie": "sid="+sid
            }
        }, function (error, response, body) {
            var data = JSON.parse(body).list;
            //杂志的年月日
            dataConversion(data);
            //处理descr字段
            deleteP(data);
            var pageCount=JSON.parse(body).pager.pageCount;
            magazineHandle = viewManager.view("magazine/magazine_essay").handle;
            jianyanHandle = viewManager.view("magazine/jianyan").handle;
            magazinePagePagingHandle = paging(pageNumber, 10, pageCount,'magazine');
            if (!error && response.statusCode == 200) {
                descr=data.descr;
                wrap.jianyan1 = jianyanHandle(data.slice(4, 5));
                wrap.magazine1 = magazineHandle(data.slice(0, 4));
                wrap.jianyan2 = jianyanHandle(data.slice(9, 10));
                wrap.magazine2 = magazineHandle(data.slice(5, 9));
                wrap.paging = magazinePagePagingHandle;
            }
            step.over();
        });
    }else{
        //请求us杂志数据
        HTTP.get({
            url: environment.api.host.concat("public/sift/list/for-website?pageNum="+pageNumber+"&pageSize=10")
        }, function (error, response, body) {
            var data = JSON.parse(body).list;
            //杂志的年月日
            dataConversion(data);
            //处理descr字段
            deleteP(data);
            var pageCount=JSON.parse(body).pager.pageCount;
            magazineHandle = viewManager.view("magazine/magazine_essay").handle;
            jianyanHandle = viewManager.view("magazine/jianyan").handle;
            magazinePagePagingHandle = paging(pageNumber, 10, pageCount,'magazine');
            if (!error && response.statusCode == 200) {
                wrap.jianyan1 = jianyanHandle(data.slice(4, 5));
                wrap.magazine1 = magazineHandle(data.slice(0, 4));
                wrap.jianyan2 = jianyanHandle(data.slice(9, 10));
                wrap.magazine2 = magazineHandle(data.slice(5, 9));
                wrap.paging = magazinePagePagingHandle;
            }
            step.over();
        });
    }

    return html;
}
module.exports = renderMagazine;