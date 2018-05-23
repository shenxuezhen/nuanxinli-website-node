/**
 * Created by Administrator on 2016/3/24.
 */
//注册一个比较大小的Helper,判断v1是否等于v2
function compare(){
    var couponHandle = Handlebars.compile($("#couponHandle").html());
    Handlebars.registerHelper("compare", function(v1, v2, options){
        if(v1 == v2){
            //满足添加继续执行
            return options.fn(this);
        }else{
            //不满足条件执行{{else}}部分
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper("assignment",function(value){
        if(value==0){
            return 'active';
        }else if(value==1){
            return 'active';
        }else if(value==2){
            return 'active';
        }else if(value==3){
            return 'active';
        }else if(value==4){
            return 'active';
        }else {
            return null;
        }
    });
}

module.exports = compare;