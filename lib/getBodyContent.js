/**
 * Created by Administrator on 2016/4/25.
 */
var viewManager = require("../lib/view_manager");
var Step = require("../lib/step");
var cheerio = require('cheerio');
var HTTP = require('request');
var environment = require("../config/env.json");

function getBodyContent(url){
    var wrap = {},
        step,
        html;
    console.log("url:"+url);
    HTTP.get({
        url: environment.api.host.concat(url)
    }, function (error, response, body) {
        console.log("page:"+body);
        var $ = cheerio.load(body,{decodeEntities: false});
        var html = $("body").html();
        console.log("page body:"+html);
        var data={};
        data.content=html;
        magazineContentHandle = viewManager.view("magazine_detail/magazineContent").handle;
        if (!error && response.statusCode == 200) {
            wrap.magainContent = magazineContentHandle(data);
        }
    });

    return html
}
module.exports = getBodyContent;