/**
 * Created by Administrator on 2016/4/26.
 */

function deleteP(data){
    var i;
    for(i=0;i<data.length;i++){
        var type=data[i].type;

        var descr=data[i].descr;
        if(type=="article"||type=="knowledge"||type=="video"){
            var a = descr;
            var b = a.replace(/<.*?>/ig,"");
            data[i].descr=b
        }
    }
    return data;
}
module.exports = deleteP;