var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var HTTP = require('request');
function renderEnterSunflowerPlan( cacheIndex, response,cookies) {
    var wrap = {},
        step,
        html;
    var sid=cookies.sid;
    step = new Step(1, function () {
        console.log("44444444");
        //渲染最终结果
        html = viewManager.view("sunflower" + cacheIndex).handle(wrap);
        //缓存
        //global.cache.put(cacheIndex, html);
        //响应
        response.send(html);
    });
    //显示登录或用户信息
    if(sid==undefined){
        var data={};
        data.YES='no';
        data.INDEX='5';
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
                data.INDEX='5';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }else if(response.statusCode == 401){
                var data={};
                data.YES='no';
                data.INDEX='5';
                loginHandle = viewManager.view("home/header").handle;
                wrap.headerContent = loginHandle(data);
            }
            step.over();
        });
    }

    return html;
}
module.exports = renderEnterSunflowerPlan;