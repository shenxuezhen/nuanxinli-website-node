/**
 * Created by Administrator on 2016/11/30.
 */
var environment = require("../config/env.json");//获取端口和访问地址
var viewManager = require("../lib/view_manager");//视图管理
var Step = require("../lib/step");//step方法主要是回调
var HTTP = require('request');//请求头
var cheerio = require('cheerio');//node抓取页面的模块，为服务器特别制定，类似于浏览器中的jquery，将HTML告诉你的服务器
var dataConversion = require('../lib/dataConversion');//处理时间
/**
 * 请求banner详情
 * @param cacheIndex 路径
 * @param response 响应头
 * @param articleSource 文章的路径
 * @param Id 点击项的id
 * @param Cookies cookie
 * @returns {*}
 */
function renderBanner_detail(cacheIndex, response, articleSource, Id, Cookies) {
    console.log('----------18----------------');
    var wrap = {},
        step,
        bannerHtml,
        bannerType=0,
        sid,
        html;//定义warp对象保存整个页面的对象，step创建Step的实例，bannerHtml为banner的载体，bannerType判断banner类型的标签，html渲染最终的结果
    console.log('------------'+Cookies+'---------------');

    console.log('------------'+typeof Cookies+'---------------');
    if(!(Cookies===null)){
        sid = Cookies.sid;//获取cookie中的变量sid
    }
    step = new Step(3, function () {//执行3次step.over()之后进入回调
        console.log("-------------44444444---------------");
        //渲染最终结果
        html = viewManager.view("banner_detail" + cacheIndex).handle(wrap);
        if(bannerType==0){//ture
            var $ = cheerio.load(html, {decodeEntities: false});//第一个参数需要处理的代码，第二个是对象，是否转实体
            $("#left").html(bannerHtml);//将实体放到对应的元素中
            //缓存
            //global.cache.put(cacheIndex, html);
            //响应
            response.send($.html());//发送响应体
        }else {
            response.send(html);//发送响应体
        }

    });

    //显示登录或用户信息

    if (!sid) {//判断cookie中是否存在sid
        console.log('---------'+sid+'---------');
        var data = {};//定义对象
        data.YES = 'no';//data添加属性YES判断是否登录（未登录）
        data.INDEX = '0';//data添加属性INDEX判断导航栏中的索引
        loginHandle = viewManager.view("home/header").handle;//最终渲染页面是home/header
        wrap.headerContent = loginHandle(data);//在全局对象里添加属性headerContent，并将data中的数据填充到渲染的页面中
        step.over();//头部信息请求结束 sum=1
    } else {
        console.log('------------52------------');
        HTTP.get({//请求用户信息
            url: environment.api.host.concat("public/user/info"),
            headers: {//发送给cookie
                "Cookie": "sid=" + sid
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {//执行成功
                var data = JSON.parse(body);//获取数据
                data.YES = 'yes';//data添加属性YES判断是否登录（登录）
                data.INDEX = '0';//data添加属性INDEX判断导航栏中的索引
                loginHandle = viewManager.view("home/header").handle;//最终渲染页面是home/header
                wrap.headerContent = loginHandle(data);//在全局对象里添加属性headerContent，并将data中的数据填充到渲染的页面中
            } else if (response.statusCode == 401) {//客户端未登录
                var data = {};//定义对象
                data.YES = 'no';//data添加属性YES判断是否登录（未登录）
                data.INDEX = '0';//data添加属性INDEX判断导航栏中的索引
                loginHandle = viewManager.view("home/header").handle;//最终渲染页面是home/header
                wrap.headerContent = loginHandle(data);//在全局对象里添加属性headerContent，并将data中的数据填充到渲染的页面中
            }
            step.over();//sum=1
        });
    }
    console.log('59--------' + Id);
    //请求banner详情
    if (articleSource) {//判断articleSource是否存在
        if(articleSource.indexOf('http://p.m.btime.com')<0) {
            HTTP.get({//请求文章路径
                url: environment.api.host.concat(articleSource)
            }, function (error, response, body) {
                console.log('###########' + body);
                if (!error && response.statusCode == 200) {//请求成功
                    var $ = cheerio.load(body, {decodeEntities: false});//第一个参数需要处理的代码，第二个是对象，是否转实体
                    console.log('69-------------' + body);
                    var ary = $("body img").each(function () {
                        var newSrc = this.attribs.src;
                        newSrc = environment.api.host + newSrc;
                        this.attribs.src = newSrc;
                    });
                    console.log(ary);
                    console.log($("body"));
                    bannerHtml = $("body").html();//将实体放到对应的容器中
                }
                step.over();//sum=2
            });
        }
    } else if (Id) {
        HTTP.get({//请求直播详情
            url: environment.api.host.concat('public/live-cast/detail?id=' + Id)
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {//请求成功
                var data = JSON.parse(body),//得到的请求体
                    type = data.type,//请求体中的type字段
                    status = data.status,//请求体中的status字段
                    content = '';//空字符串
                console.log('91--------' + data);
                if (type == 'live' && status == '0') {//预告
                    content = 'http://app.nuanxinli.com/warm/forecastBanner.html?id=' + Id;
                } else if (type == 'live' && status == '1') {//直播
                    content = 'http://app.nuanxinli.com/warm/live_share.html?id=' + Id;
                }else {//回放
                    content = 'http://app.nuanxinli.com/warm/live_share.html?id=' + Id;
                }
                console.log(content);
                wrap.content=content;//将返回的地址放到wrap对象中
                bannerType=1;//此时是直播banner
            }
            step.over();//sum=2
        });
    }

//请求杂志数据
    HTTP.get({//请求杂志列表
        url: environment.api.host.concat("public/sift/today-list")
    }, function (error, response, body) {
        var data = JSON.parse(body);//将请求回来的数据赋值给data变量
        dataConversion(data);//通过此方法，改变data中的数据，添加属性VOL,year,month,date
        magazineDataHandle = viewManager.view("home/magaine_data").handle;//将时间的结果渲染到home/magaine_data页面
        magazineHandle = viewManager.view("home/magazine").handle;//将请求回来的数据结果渲染到home/magazine页面
        if (!error && response.statusCode == 200) {
            console.log("data[0]:" + JSON.stringify(data[4]));
            wrap.magazineData = magazineDataHandle(data[4]);//取数据的第五条，因为处理时间的dataConversion方法处理的是第五条，也可以是第10条
            console.log("wrap.magazineData:" + wrap.magazineData);
            wrap.magazine = magazineHandle(data.slice(0, 5));//将获取到的前五条数据放到wrap这个对象里面
        }
        step.over();//sum=3
    });
    return html;
}
module.exports = renderBanner_detail;