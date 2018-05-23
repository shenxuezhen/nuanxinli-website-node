/**
 * Created by Administrator on 2016/4/14.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
var paging = require('../lib/paging');

function renderCounselor( cacheIndex, response,pageNumber,Cookies) {
    var wrap = {},
        step,
        html;
    step = new Step(2, function () {
        //渲染最终结果
        html = viewManager.view("counselor" + cacheIndex).handle(wrap);
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
        data.INDEX='1';
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
                data.INDEX='1';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }else if(response.statusCode == 401){
                var data={};
                data.YES='no';
                data.INDEX='1';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }
            step.over();
        });

    }
    //请求咨询师
    HTTP.get({
        url: environment.api.host.concat("public/consultant/list/for-website?pageNum="+pageNumber+"&pageSize=7")
    }, function (error, response, body) {
        var data = JSON.parse(body).list;
        var pageCount=JSON.parse(body).pager.pageCount;
        //console.log("pageCount: d%",pageCount)
        counselorHandle = viewManager.view("counselor/counselors").handle;
        counselorPagingHandle = paging(pageNumber, 7, pageCount,'counselor');
        if (!error && response.statusCode == 200) {
            wrap.counselors = counselorHandle(data.slice(0, 7));
            wrap.paging = counselorPagingHandle;

        }

        step.over();
    });

    return html;
}
module.exports = renderCounselor;