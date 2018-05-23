/*
    缓存模块
*/

function Cache(ttl){
    this.pool = {};
    //ttl输入为分钟，内部转换成毫秒
    this.ttl = ttl * 60 * 1000;
}

Cache.prototype.put = function(k, v){
    var e;
    
    if(k && v){
        e = this.element(k, v);
        this.pool[k] = e;
    }
};

Cache.prototype.element = function(k, v){
    var e = {};
    
    e.v = v;
    e.past = (new Date()).getTime() + this.ttl;
    
    return e;
};

Cache.prototype.get = function(k){
    var e;
    
    if(!k){
      return undefined;
    }
    
    e = this.pool[k];
    
    if(!e){
      return e;
    }
    
    if(e.past > (new Date()).getTime()){
        return e.v;
    }else{
        this.pool[k] = undefined;
        return undefined;
    }
};

/*
    缓存代理，只暴露部分方法
*/
function CacheProxy(ttl){
    this.cache = new Cache(ttl);
}

CacheProxy.prototype.put = function(){
    return this.cache.put.apply(this.cache, arguments);
};

CacheProxy.prototype.get = function(){
    return this.cache.get.apply(this.cache, arguments);
};


module.exports = CacheProxy;
