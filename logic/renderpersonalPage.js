/**
 * Created by Administrator on 2016/4/14.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
var paging3 = require('../lib/paging3');
var paging4 = require('../lib/paging4');
function renderpersonalPage( cacheIndex, response,pageNumber,cookies,tabs,magazineNumber) {
    var wrap = {},
        step,
        html;
    var sid=cookies.sid;
    var data2={type:tabs,recordCount1:0,recordCount2:0,recordCount3:0,recordCount4:0,recordCount15:0}
    data2.magazineNumber=magazineNumber;
    step = new Step(8,function () {
        tabsHandle=viewManager.view("personalPage/tab").handle;
        wrap.tabs=tabsHandle(data2);
        //渲染最终结果
        html = viewManager.view("personalPage" + cacheIndex).handle(wrap);
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
    console.log(magazineNumber);
    //请求我的杂志数据
    HTTP.post({
        url: environment.api.host.concat("public/sift-collection/my-list/for-website?pageNum="+magazineNumber+"&pageSize=5"),
        headers: {
            "Cookie": "sid="+sid
        },
        body: "{afterId:0, count:5}"
    }, function (error, response, body) {
//        console.log("response body : %s", body);
        var pageCount=JSON.parse(body).pager.pageCount;
        var data = JSON.parse(body).list;
            magazineHandle = viewManager.view("personalPage/magazine").handle;
            MPagingHandle = paging4(pageNumber, 5,pageCount,"personalPage",tabs,magazineNumber);
        if (!error && response.statusCode == 200) {
            wrap.magazine = magazineHandle(data.slice(0, 5));
            wrap.magazinPaging = MPagingHandle;

        }
        step.over();
    });

    //请求用户数据
    HTTP.get({
        url: environment.api.host.concat("public/user/info"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {

        var data = JSON.parse(body),
            personalHandle = viewManager.view("personalPage/personalMassage").handle;
            outLonginlHandle = viewManager.view("personalPage/outLongin").handle;
        if (!error && response.statusCode == 200) {
            wrap.personalMassage = personalHandle(data);
            wrap.outLongin = outLonginlHandle(data);
        }
        step.over();
    });
    //请求帖子数据
    HTTP.get({
        url: environment.api.host.concat("public/bbs-post/user-list/for-website?pageNum="+pageNumber+"&pageSize=10"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {

        data2.recordCount1=JSON.parse(body).pager.recordCount;
        if(tabs==1){
            var data = JSON.parse(body).list;
            var pageCount=JSON.parse(body).pager.pageCount;
            personalPostHandle = viewManager.view("personalPage/personalPost").handle;
            personalPagingHandle = paging3(pageNumber, 10,pageCount,"personalPage",tabs,magazineNumber);
            if (!error && response.statusCode == 200) {
                wrap.personalPost = personalPostHandle(data.slice(0, 10));
                if(pageCount>1){
                    wrap.paging=personalPagingHandle;
                }
            }
        }
        step.over();
    });

    //请求咨询数据
    HTTP.get({
        url: environment.api.host.concat("public/consulting-service/get-my-list/for-website?pageNum="+pageNumber+"&pageSize=10"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {
        console.log("....",body);
        data2.recordCount2=JSON.parse(body).pager.recordCount;
        if(tabs==2){
            var data = JSON.parse(body).list;
            var pageCount=JSON.parse(body).pager.pageCount;
            personalPostHandle = viewManager.view("personalPage/personalconsultation").handle;
            personalPagingHandle = paging3(pageNumber, 10,pageCount,"personalPage",tabs,magazineNumber);
            if (!error && response.statusCode == 200) {
                wrap.personalPost = personalPostHandle(data.slice(0, 10));
                if(pageCount>1){
                    wrap.paging=personalPagingHandle;
                }
            }
        }
        step.over();
    });

    //请求解梦数据
    HTTP.get({
        url: environment.api.host.concat("public/dream-service/get-my-list/for-website?pageNum="+pageNumber+"&pageSize=10"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {
        data2.recordCount3=JSON.parse(body).pager.recordCount;
        if(tabs==3){
            var data = JSON.parse(body).list;
            var pageCount=JSON.parse(body).pager.pageCount;
            personalPostHandle = viewManager.view("personalPage/personaldream").handle;
            personalPagingHandle = paging3(pageNumber, 10,pageCount,"personalPage",tabs,magazineNumber);
            if (!error && response.statusCode == 200) {
                wrap.personalPost = personalPostHandle(data.slice(0, 10));
                if(pageCount>1){
                    wrap.paging=personalPagingHandle;
                }
            }
        }
        step.over();
    });
    //请求优惠券
    HTTP.get({
        url: environment.api.host.concat("/public/coupon/my-list?serviceType=all"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {
        data2.recordCount4=JSON.parse(body).pager.recordCount;
        if(tabs==4){
            var data = JSON.parse(body).list;
            var pageCount=JSON.parse(body).pager.pageCount;
            personalPostHandle = viewManager.view("personalPage/personaldream").handle;
            personalPagingHandle = paging3(pageNumber, 10,pageCount,"personalPage",tabs,magazineNumber);
            if (!error && response.statusCode == 200) {
                wrap.personalPost = personalPostHandle(data.slice(0, 10));
                if(pageCount>1){
                    wrap.paging=personalPagingHandle;
                }
            }
        }
        step.over();
    });
    //请求我的收藏
    HTTP.get({
        url: environment.api.host.concat("public/dream-service/get-my-list/for-website?pageNum="+pageNumber+"&pageSize=10"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {
        data2.recordCount3=JSON.parse(body).pager.recordCount;
        if(tabs==3){
            var data = JSON.parse(body).list;
            var pageCount=JSON.parse(body).pager.pageCount;
            personalPostHandle = viewManager.view("personalPage/personaldream").handle;
            personalPagingHandle = paging3(pageNumber, 10,pageCount,"personalPage",tabs,magazineNumber);
            if (!error && response.statusCode == 200) {
                wrap.personalPost = personalPostHandle(data.slice(0, 10));
                if(pageCount>1){
                    wrap.paging=personalPagingHandle;
                }
            }
        }
        step.over();
    });
    //获取关注
    HTTP.get({
        url: environment.api.host.concat("public/user-follow/my-list?pageNum=1&pageSize=1"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {
        var data=JSON.parse(body).pager;
        //console.log('@@@@@@@@@@@@@@');
        //console.log(body);
        followHandle = viewManager.view("personalPage/follow").handle;
        if (!error && response.statusCode == 200) {
            wrap.follow = followHandle(data);
        }
        step.over();
    });

     //获取粉丝
    HTTP.get({
        url: environment.api.host.concat("public/user-follow/list?pageNum=1&pageSize=1"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {
        //console.log('##############');
        //console.log(body);
        var data=JSON.parse(body).pager;
        follow2Handle = viewManager.view("personalPage/follow2").handle;
        if (!error && response.statusCode == 200) {
            wrap.follow2 = follow2Handle(data);
        }
        step.over();
    });
    return html;
}
module.exports = renderpersonalPage;