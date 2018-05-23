/**
 * Created by Administrator on 2016/4/14.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
function renderCounselor_detail( cacheIndex, response,consultantId,Cookies) {
    var wrap = {},
        step,
        html;
    step = new Step(2, function () {
        //渲染最终结果
//        console.log("%s", "viewManager:", "magazine" + cacheIndex);
        html = viewManager.view("counselor_detail" + cacheIndex).handle(wrap);
        //缓存
        //global.cache.put(cacheIndex, html);
        //响应
        response.send(html);
    });


    //请求咨询师详情数据
    //var consultantId=getUrlParam(address,consultantId);
    //console.log("consultantId: %d",consultantId)
    //HTTP.get({
    //    url: environment.api.host.concat("backend/consultant/list/for-website?pageNum=1&pageSize=8")
    //}, function (error, response, body) {
    //    var data = JSON.parse(body),
    //        counselorHandle = viewManager.view("counselor_detail/counselorPage").handle;
    //    if (!error && response.statusCode == 200) {
    //        wrap.counselor = counselorHandle(data.slice(0, 1));
    //    }
    //
    //    step.over();
    //});

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
    //请求咨询数据
    HTTP.get({
        url: environment.api.host.concat("public/consultant/"+consultantId+"/for-website")
    }, function (error, response, body) {
        var data = JSON.parse(body);
        var counselorHandle = viewManager.view("counselor_detail/counselorPage").handle;
        if (!error && response.statusCode == 200) {
            wrap.counselor = counselorHandle(data);
        }

        step.over();
    });
    return html;
}
module.exports = renderCounselor_detail;