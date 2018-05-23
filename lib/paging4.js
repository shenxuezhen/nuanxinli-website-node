/**
 * Created by Administrator on 2016/4/14.
 */
function paging4(page, size,count,url,tabs,magazineNumber){
    var html = [],
        schema = [0, 0, 0, 0, 0],
        _page,
        offset,
        i;

    html.push('<ul class="pageUl">');

    //上一页
    if(magazineNumber > 1){
        html.push('<li class="prev"><a href="'+url+'.html?page='+page +'&size='+ size +'&tabs='+tabs+'&mNumber='+(magazineNumber-1)+'">&lt;上一页</a></li>');
    }

    //选择页
    if(magazineNumber != 1){
        schema[0] = 1;
    }
    if(magazineNumber != count){
        schema[5] = count;
    }
    schema[3] = magazineNumber;
    _page = magazineNumber - 1;
    offset = 2;
    while(_page > 1 && offset > 0){
        schema[offset] = _page;
        _page = _page - 1;
        offset = offset - 1;
    }
    _page = magazineNumber + 1;
    offset = 4;
    while(_page < count && offset < 6){
        schema[offset] = _page;
        _page = _page + 1;
        offset = offset + 1;
    }
    for(i = 0; i < schema.length; i++){
        if(i == 3){
            html.push('<li><a class="on" href="'+url+'.html?page='+ page +'&size='+ size +'&tabs='+tabs+'&mNumber='+schema[i]+'">'+ schema[i] +'</a></li>');
            continue;
        }
        if(schema[i]){
            html.push('<li><a href="'+url+'.html?page='+page+'&size='+ size +'&tabs='+tabs+'&mNumber='+schema[i]+'">'+ schema[i] +'</a></li>');
        }
    }

    //下一页
    if(magazineNumber < count){
        html.push('<li class="next"><a href="'+url+'.html?page='+ page +'&size='+ size +'&tabs='+tabs+'&mNumber='+(magazineNumber+1)+'">下一页&gt;</a></li>');
    }

    ////页面跳转
    //html.push('<form action="javascript:;">');
    //html.push('<li>到第 <input class="pageIpt" type="text" /> 页</li>');
    //html.push('<li>');
    //html.push('<button class="pageBtn">确定</button>');
    //html.push('</li>');
    //html.push('</form>');
    //
    //html.push('</ul>');

    return html.join("");
}
module.exports = paging4;