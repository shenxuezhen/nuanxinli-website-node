/**
 * Created by Administrator on 2016/4/14.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
var paging2 = require('../lib/paging2');
var dataConversion = require('../lib/dataConversion');
function renderQuanquan_detail( cacheIndex, response,pageNumber,id,cookies) {
    var wrap = {},
        step,
        html;
    var sid=cookies.sid;
    step = new Step(4, function () {
        html = viewManager.view("quanquan_detail" + cacheIndex).handle(wrap);
        //缓存
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

    //请求帖子详情数据
    HTTP.get({
        url: environment.api.host.concat("public/bbs-post/"+id),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {
        console.log( environment.api.host.concat("public/bbs-post/"+id))
        console.log("@@@@@@@@@@@@@@@@@@ %s", body);

        var data = JSON.parse(body);
        data.cookie=sid;
        quanquan_detailHandle = viewManager.view("quanquan_detail/quanquanDCent").handle;
        if (!error && response.statusCode == 200) {
            wrap.quanquanDCent = quanquan_detailHandle(data);
        }
        step.over();
    });
    //请求帖子所有评论
    HTTP.get({
        url: environment.api.host.concat("public/bbs-post/"+id+"/bbs-reply/list?pageNum="+pageNumber+"&pageSize=10"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {
        console.log("################## %s", body);
        var data = JSON.parse(body).list;
        var pageCount=JSON.parse(body).pager.pageCount;
        quanquanCommentHandle = viewManager.view("quanquan_detail/quanquanComment").handle;
        personalPagingHandle = paging2(pageNumber, 10, pageCount,"quanquan_detail",id);
        if (!error && response.statusCode == 200) {
            wrap.quanquanComment = quanquanCommentHandle(data.slice(0, 10));
            //if(pageCount>1){
            wrap.paging=personalPagingHandle;
            //}
        }
        step.over();
    });
    return html;
}
module.exports = renderQuanquan_detail;