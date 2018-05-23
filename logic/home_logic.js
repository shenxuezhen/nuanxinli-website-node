var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var log = require("../lib/log").logger("user");
var HTTP = require('request');
var URL = require('url');
var hbs = require('hbs');
var paging = require('../lib/paging');
var paging5 = require('../lib/paging5');
var loopjson= require('../lib/loopjson');
var isLogin= require('../lib/sid_getUserMassage');
var dataConversion = require('../lib/dataConversion');
var renderCounselor= require('../logic/renderCounselor');
var renderCounselor_detail= require('../logic/renderCounselor_detail');
var renderMagazine= require('../logic/renderMagazine');
var renderMagazine_detail= require('../logic/renderMagazine_detail');
var renderQuanquan= require('../logic/renderQuanquan');
var renderQuanquan_detail= require('../logic/renderQuanquan_detail');
var renderpersonalPage= require('../logic/renderpersonalPage');
var renderAbourt= require('../logic/renderAbourt');
var renderguestPage= require('../logic/renderguestPage');
var renderBanner_detail=require('../logic/renderBanner_detail');
var renderEnterService=require('../logic/renderEnterService');
var renderEnterSunflowerPlan=require('../logic/renderEnterSunflowerPlan');
var httpRenderLogic=require('../lib/httpRenderLogic');
var userLogic=require('../lib/userLogic');
//*****************************************主页的渲染begin*******************************************//
exports.index = function (request, response) {
    var wrap = {},
        step,
        html;
    //获取cookie;
    var Cookies = {};
    request.headers.cookie && request.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    console.log('Cookies:');
    console.dir(Cookies);
    var sid=Cookies.sid;
    //先从缓存中取
    //html = global.cache.get("/");
    /*if (html) {
        response.send(html);
        return;
    }*/

    step = new Step(5, function () {
        //渲染最终结果
        console.log(wrap);
        html = viewManager.view("home/index").handle(wrap);
        console.log(html);
        //缓存
        //global.cache.put("/", html);
        //响应
        response.send(html);
    });
    //显示登录或用户信息
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
            } else if(response.statusCode == 401){
                var data={};
                data.YES='no';
                data.INDEX='0';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }
            step.over();
        });
    }
    //请求banner列表
    HTTP.get({
        url: environment.api.host.concat("public/cast-banner/list")
    }, function (error, response, body) {
        var data = JSON.parse(body),
            bannerHandle = viewManager.view("home/banner").handle;
        if (!error && response.statusCode == 200) {
            wrap.bannerMaster = bannerHandle(data);
        }
        step.over();
    });

    //请求咨询师列表
    httpRenderLogic(
        "public/consultant/list/for-website?pageNum=1&pageSize=8",
        [
            {
                name: "counselorMaster",
                view:"home/counselor",
                dataMin:0,
                dataMax:4
            },
            {
                name: "counselorDirector",
                view:"home/counselor",
                dataMin:4,
                dataMax:8
            }
        ],
        wrap,
        step
    );

    //请求圈圈数据
    httpRenderLogic(
        "public/bbs-post/list/for-website?pageNum=1&pageSize=4",
        [
            {
                name: "quanquan",
                view:"home/quanquan",
                dataMin:0,
                dataMax:4
            }
        ],
        wrap,
        step
    );
    //请求杂志数据
    httpRenderLogic(
        "public/sift/today-list",
        [
            {
                name: "magazineDate",
                view:"home/magaine_data",
                dataMin:4,
                dataMax:5
            },
            {
                name: "magazine",
                view:"home/magazine",
                dataMin:0,
                dataMax:4
            }
        ],
        wrap,
        step,
        dataConversion
    );
};
//*****************************************主页的渲染end*******************************************//
exports.p2 = function (request, response, address) {
    console.log('141---------'+request,address,address);
    var cacheIndex = parseViewManagerPath(address);
    var consultantId=getUrlParam(request.url,'consultantId');
    var heartKind=getUrlParam(request.url,'kind');
    var pageNum=parseInt(getUrlParam(request.url,'page'));
    var tabs=parseInt(getUrlParam(request.url,'tabs'));
    var siftId=parseInt(getUrlParam(request.url,'siftId'));
    var Id=parseInt(getUrlParam(request.url,'Id'));
    var login=parseInt(getUrlParam(request.url,'login'));
    var username=getUrlParam(request.url,'username');
    var magazineNumber=parseInt(getUrlParam(request.url,'mNumber'));
    var articleSource=getUrlParam(request.url,'source');
    if(pageNum===0){
        pageNum=1;
    }else{
    }
    if(magazineNumber===0){
        magazineNumber=1;
    }else{
    }
    //获取cookie;
    var Cookies = {};
    request.headers.cookie && request.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    //先从缓存中取
    /*html = global.cache.get(cacheIndex);
    if (html) {
        response.send(html);
        return;
    }*/
    console.log('171----'+cacheIndex+',----'+Id+',----'+siftId);
    switch (cacheIndex) {
        case "/counselor": return renderCounselor(cacheIndex,  response,pageNum,Cookies); break;
        case "/magazine": return renderMagazine(cacheIndex,  response,pageNum,Cookies); break;
        case "/quanquan": return renderQuanquan(cacheIndex,  response,pageNum,heartKind,Cookies); break;
        case "/quanquan_detail": return renderQuanquan_detail(cacheIndex,  response,pageNum,Id,Cookies); break;
        case "/activity": return renderActivity(cacheIndex,  response,Cookies); break;
        case "/magazine_detail": return renderMagazine_detail(cacheIndex, response,siftId,Cookies); break;
        case "/counselor_detail": return renderCounselor_detail(cacheIndex, response,consultantId,Cookies); break;
        case "/login": return renderLogin(cacheIndex, response,login); break;
        case "/forget": return renderForget(cacheIndex, response); break;
        case "/personalPage": return renderpersonalPage(cacheIndex, response,pageNum,Cookies,tabs,magazineNumber); break;
        case "/edit": return renderEdit(cacheIndex, response,Cookies,pageNum); break;
        case "/abourtWarm": return renderAbourt(cacheIndex, response,Cookies); break;
        case "/guestPage": return renderguestPage(cacheIndex, response,pageNum,Cookies,username); break;
        case "/banner_detail": return renderBanner_detail(cacheIndex,response,articleSource,Id,Cookies);break;
        case "/enterService": return renderEnterService(cacheIndex, response,Cookies); break;
        case "/enterSunflowerPlan": return renderEnterSunflowerPlan(cacheIndex, response,Cookies); break;
        default:break;
    }
};
//*****************************************登录\注册begin*******************************************//
function renderLogin( cacheIndex, response,login) {
    var wrap = {},
        step,
        html;
    var data={};
        data.login=login;
        loginHandle = viewManager.view("login/loginOrReguster").handle;
        wrap.loginOrReguster=loginHandle(data);
        html = viewManager.view("login" + cacheIndex).handle(wrap);
        //缓存
        //global.cache.put(cacheIndex, html);
        //响应
        response.send(html);
    return html;
}
//忘记密码
function renderForget( cacheIndex, response) {
    var wrap = {},
        step,
        html;
    var data={};
    html = viewManager.view("login" + cacheIndex).handle(wrap);

    //缓存
    //global.cache.put(cacheIndex, html);
    //响应
    response.send(html);
    return html;
}
//*****************************************登录\注册end*******************************************//
function renderFirstpage( cacheIndex, response,Cookies){}
//*****************************************咨询主、详情页的渲染begin*******************************************//
function renderCounselor( cacheIndex, response,pageNumber,Cookies){}
function renderCounselor_detail( cacheIndex, response,consultantId,Cookies){}
//**********************************************咨询主、详情页的渲染end***********************************************//
//**********************************************杂志页的渲染begin***********************************************//
function renderMagazine( cacheIndex, response,pageNumber,cookies){}
function renderMagazine_detail( cacheIndex, response,id,Cookies){}
//**********************************************杂志页的渲染end***********************************************//
//**********************************************quan quan begin**********************************************//
function renderQuanquan( cacheIndex, response,pageNumber,heartKind,cookies){}
function renderQuanquan_detail( cacheIndex, response,pageNumber,id,cookies){}
//**************************************************quan quan end**********************************************//
//**************************************************个人主页 begin**********************************************//
function renderpersonalPage( cacheIndex, response,pageNumber,cookies,tabs,magazineNumber){}
//**************************************************个人主页 end**********************************************//
//**************************************************客人个人主页 begin**********************************************//
function renderguestPage( cacheIndex, response,pageNumber,cookies,username){}
//**************************************************客人个人主页 end**********************************************//
//**************************************************banner begin**********************************************//
function renderBanner_detail(cacheIndex,response,siftId,Cookies){}
//**************************************************banner end**********************************************//
//***********************************************个人资料begin ******************************************//
function renderEdit( cacheIndex, response,cookies,pageNumber) {
    var wrap = {},
        step,
        html;
    var sid=cookies.sid;
    step = new Step(5, function () {
        //渲染最终结果
        html = viewManager.view("editPage" + cacheIndex).handle(wrap);
        //缓存
        //global.cache.put(cacheIndex, html);
        //响应
        response.send(html);
    });
    //显示登录或用户信息
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
    //请求用户数据
    HTTP.get({
        url: environment.api.host.concat("public/user/info"),
        headers: {
            "Cookie": "sid="+sid
        }
    }, function (error, response, body) {


        var data = JSON.parse(body);
        var number= parseInt(loopjson(data)/7*100);
        data.user=body;
        data.cookie=sid;
        data.Number=number+"%";
        editPageHandle = viewManager.view("editPage/editMassage").handle;
        if (!error && response.statusCode == 200) {
            wrap.editPageMassage = editPageHandle(data);

        }
        step.over();
    });

    //请求我的杂志数据
    HTTP.post({
        url: environment.api.host.concat("public/sift-collection/my-list/for-website?pageNum="+pageNumber+"&pageSize=5"),
        headers: {
            "Cookie": "sid="+sid
        },
        body: "{afterId:0, count:5}"
    }, function (error, response, body) {
        var data = JSON.parse(body).list;
        var pageCount=JSON.parse(body).pager.pageCount;
        magazineHandle = viewManager.view("personalPage/magazine").handle;
        magazinPageHandle=paging5(pageNumber, 5, pageCount,"edit");
        if (!error && response.statusCode == 200) {
            wrap.magazine = magazineHandle(data.slice(0, 5));
            wrap.magazinePaging = magazinPageHandle;

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
//***********************************************个人资料end ******************************************//
//***********************************************关于我们 start ******************************************//
function renderAbourt( cacheIndex, response,cookies){}
//***********************************************关于我们 end ******************************************//
//***********************************************企业服务 start ******************************************//
function renderEnterService( cacheIndex, response,cookies){}
//***********************************************企业服务 end ******************************************//
//***********************************************向日葵计划 start ******************************************//
function renderEnterSunflowerPlan( cacheIndex, response,cookies){}
//***********************************************向日葵计划 end ******************************************//
/**/
function renderBanner_detail( cacheIndex,response,pageNum,Cookies,username){}
function loopjson(data){
    var number=0;
    $.each(data,function(){
        if(sexDisplay!=""){
            number+=1;
        }
        if(age!=""){
            number+=1;
        }
        if(photo!=""){
            number+=1;
        }
        if(email!=""){
            number+=1;
        }
        if(cellPhone!=""){
            number+=1;
        }
        if(descr!=""){
            number+=1;
        }
        if(userType!=""){
            number+=1;
        }
        if(alias!=""){
            number+=1;
        }
        return number;
    })
}
//从连接中提取其中的数值
function getUrlParam(url,name){
    var pattern = new RegExp("[?&]" + name +"\=([^&]+)","g");
    var matcher = pattern.exec(url);
    var items = null;
    if(matcher != null){
        try{
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
        }catch(e){
            try{
                items = decodeURIComponent(matcher[1]);
            }catch(e){
                items = matcher[1];
            }
        }
    }
    return items;
}
//获取相应路径
function parseViewManagerPath(address){
    //var consultantId=getUrlParam(address,consultantId);
    //console.log("consultantId: %d",consultantId);

    var pos = address.lastIndexOf(".html");
    if (pos<0){
        return "/"+address;
    }else{
        return "/"+address.substring(0, pos);
    }
}
//var couponHandle = hbs.compile($("#couponHandle").html());
hbs.registerHelper("compare", function(v1, v2, options){
    if(v1 == v2){
        //满足添加继续执行
        return options.fn(this);
    }else{
        //不满足条件执行{{else}}部分
        return options.inverse(this);
    }
});