/**
 * Created by Administrator on 2016/4/6.
 */
    function loopjson(data){
        var number=0;

            for(var key in data){
                if(key=="sexDisplay"&&data[key]!=""){
                    number+=1;
                }
                if(key=="age"&&data[key]!=""){
                    number+=1;
                }
                if(key=="photo"&&data[key]!=""){
                    number+=1;
                }
                if(key=="email"&&data[key]!=""){
                    number+=1;
                }
                if(key=="cellPhone"&&data[key]!=""){
                    number+=1;
                }
                if(key=="descr"&&data[key]!=""){
                    number+=1;

                }
                if(key=="userType"&&data[key]!=""){
                    number+=1;
                }
            }
           return number;

    }
module.exports = loopjson;