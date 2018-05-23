/**
 * Created by Administrator on 2016/12/15.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var HTTP = require('request');
function httpRenderLogic(url, def, wrap, step,dataConversion) {
    HTTP.get({
        url: environment.api.host.concat(url)
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            step.over();
            return;
        }
        var data = JSON.parse(body);
        if(Object.prototype.toString.call(data)=='[object Object]'){
            data=data.list
        }
        if (dataConversion && dataConversion instanceof Function) {
            dataConversion(data);
        }
        for (var i = 0; i < def.length; i++) {
            var handle = viewManager.view(def[i].view).handle;
            if((def[i].dataMax-def[i].dataMin)==1){
                wrap[def[i].name] = handle(data.slice(def[i].dataMin,def[i].dataMax)[0]);
                continue;
            }
            wrap[def[i].name] = handle(data.slice(def[i].dataMin,def[i].dataMax));
        }
        step.over();
    });
}
/*httpRenderLogic(
 "public/sift/today-list",
 [
 {
 name: "data",
 view:"home/magaine_data",
 dataMin:4,
 dataMax:4
 },
 {
 name: "list",
 view:"home/magazine",
 dataMin:0,
 dataMax:3
 }
 ],
 {},
 step,
 dataConversion
 );*/
module.exports = httpRenderLogic;
