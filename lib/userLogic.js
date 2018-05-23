/**
 * Created by Administrator on 2016/12/19.
 */
var environment = require("../config/env.json");
var viewManager = require("../lib/view_manager");
var HTTP = require('request');
function userLogic(sid, def, warp, step) {
    if (sid == undefined) {
        var data = {};
        data.YES = 'no';
        data.INDEX = '0';
        loginHandle = viewManager.view("home/header").handle;
        warp.headerContent = loginHandle(data);
        step.over();
    } else {
        HTTP.get({
            url: environment.api.host.concat("public/user/info"),
            headers: {
                "Cookie": "sid=" + sid
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                for (var i = 0; i < def.length; i++) {
                    if (def[i].YES != 'yes')return;
                    data.YES = def[i].YES;
                    data.INDEX = def[i].INDEX;
                }

                loginHandle = viewManager.view("home/header").handle;
                warp.headerContent = loginHandle(data);
            } else if (response.statusCode == 401) {
                var data = {};
                for (var i = 0; i < def.length; i++) {
                    if (def[i].YES != 'no')return;
                    data.YES = def[i].YES;
                    data.INDEX = def[i].INDEX;
                }
                loginHandle = viewManager.view("home/header").handle;
                warp.headerContent = loginHandle(data);
            }
            step.over();
        });
    }
}
/*userLogic(
 sid,
 [
 {
 YES:'yes',
 INDEX:0
 },
 {
 YES:'no',
 INDEX:0
 }
 ],
 {},
 step
 );*/
module.exports=userLogic;