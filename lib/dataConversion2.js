/**
 * Created by Administrator on 2016/4/20.
 */

function dataConversion2(data){
    var time1=data.postTime;
    var date1 = new Date("2015-04-08 13:09:49");
    var date2 = new Date(time1);
    var date3=date2-date1;
    var VOL = Math.floor(date3/86400000);
    var year=date2.getFullYear();
    var month=date2.getMonth()+1;
    var date=date2.getDate();
    data.VOL=VOL;
    data.year=year;
    data.month=month;
    data.date=date;
    return data;
}
//把时间转换成毫秒数

//var strtime = '2014-04-23 18:55:49:123';
//var date = new Date(strtime); //传入一个时间格式，如果不传入就是获取现在的时间了，这样做不兼容火狐。
//var arr = strtime.replace(/ |:/g, '-').split('-');
//date = new Date(Date.UTC(arr[1], arr[2], arr[3], arr[4], arr[5]));
//time1 = date.getTime();//精确到毫秒
//time2 = date.valueOf();//精确到毫秒
//time3 = Date.parse(date);//

//把毫秒数转换为相应的时间

//var date = new Date(时间戳); //获取一个时间对象  注意：如果是uinx时间戳记得乘于1000。比如php函数time()获得的时间戳就要乘于1000
//date.getFullYear();  // 获取完整的年份(4位,1970)
//date.getMonth();  // 获取月份(0-11,0代表1月,用的时候记得加上1)
//date.getDate();  // 获取日(1-31)
//date.getTime();  // 获取时间(从1970.1.1开始的毫秒数)
//date.getHours();  // 获取小时数(0-23)
//date.getMinutes();  // 获取分钟数(0-59)
//date.getSeconds();  // 获取秒数(0-59)
module.exports = dataConversion2;