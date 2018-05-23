/**
 * Created by Administrator on 2016/4/14.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
var cheerio = require('cheerio');
var dataConversion = require('../lib/dataConversion');
var dataConversion2 = require('../lib/dataConversion2');

function renderMagazine_detail( cacheIndex, response,id,Cookies) {
    var wrap = {},
        step,
        magazineHtml,
        html;
    var sid=Cookies.sid;
    step = new Step(4, function () {
        //渲染最终结果
//        console.log("%s", "viewManager:", "magazine" + cacheIndex);
        html = viewManager.view("magazine_detail" + cacheIndex).handle(wrap);
        var $ = cheerio.load(html,{decodeEntities: false});
        $("#desContent").html(magazineHtml);
        //缓存
        //global.cache.put(cacheIndex, html);
        //响应
        response.send($.html());
    });
    console.log('28---------'+id);
    //显示登录或用户信息
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
    //请求杂志详情数据
    HTTP.get({
        url: environment.api.host.concat("public/sift/"+id)
    }, function (error, response, body) {
        magazinePageHandle = viewManager.view("magazine_detail/magazinePage1").handle;
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            dataConversion2(data);
            var descr= JSON.parse(body).descr;
            var type=JSON.parse(body).type;
            if(type=="test-article"||type=="article"){
                var content = JSON.parse(body).content;
                HTTP.get({
                    url: environment.api.host.concat(content)
                }, function (error, response, body) {
                    console.log(body);
                    console.log(environment.api.host.concat(content));
                    magazinePageHandle = viewManager.view("magazine_detail/magazinePage2").handle;
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                        var $ = cheerio.load(body,{decodeEntities: false});
                        console.log(body);
                        magazineHtml = $("body").html();
                        console.log(magazineHtml);
                        wrap.magazinePage = magazinePageHandle(data);
                    }
                    step.over();
                });
            }else{
                console.log(data);
                magazineHtml=descr;
                step.over();
            }
            wrap.magazinePage = magazinePageHandle(data);
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
    return html;
}
module.exports = renderMagazine_detail;