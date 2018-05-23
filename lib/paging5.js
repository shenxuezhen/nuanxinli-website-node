/**
 * Created by Administrator on 2016/4/14.
 */

//分页
function paging(page, size, count,url){
    var html = [],
        schema = [0, 0, 0, 0, 0, 0, 0],
        _page,
        offset,
        i;

    html.push('<ul class="pageUl">');

    //上一页
    if(page > 1){
        html.push('<li class="prev"><a href="'+url+'.html?page='+ (page - 1) +'&size='+ size +'">&lt;上一页</a></li>');
    }

    //选择页
    if(page != 1){
        schema[0] = 1;
    }
    if(page != count){
        schema[6] = count;
    }
    schema[3] = page;
    _page = page - 1;
    offset = 2;
    while(_page > 1 && offset > 0){
        schema[offset] = _page;
        _page = _page - 1;
        offset = offset - 1;
    }
    _page = page + 1;
    offset = 4;
    while(_page < count && offset < 6){
        schema[offset] = _page;
        _page = _page + 1;
        offset = offset + 1;
    }
    for(i = 0; i < schema.length; i++){
        if(i == 3){
            html.push('<li><a class="on" href="'+url+'.html?page='+ schema[i] +'&size='+ size +'">'+ schema[i] +'</a></li>');
            continue;
        }
        if(i==1&&page>=5){
            html.push('<li>&nbsp;.&nbsp;.&nbsp;.&nbsp;.&nbsp;.&nbsp;</li>');
        }
        if(i==6&&page<=count-3){
            html.push('<li>&nbsp;.&nbsp;.&nbsp;.&nbsp;.&nbsp;.&nbsp;</li>');
        }
        if(schema[i]){
            html.push('<li><a href="'+url+'.html?page='+ schema[i] +'&size='+ size +'">'+ schema[i] +'</a></li>');
        }
    }

    //下一页
    if(page < count){
        html.push('<li class="next"><a href="'+url+'.html?page='+ (page + 1) +'&size='+ size +'">下一页&gt;</a></li>');
    }

    //页面跳转
    //html.push('<form action="javascript:;">');
    //html.push('<li>到第 <input class="pageIpt" type="text" /> 页</li>');
    //html.push('<li>');
    //html.push('<button class="pageBtn">确定</button>');
    //html.push('</li>');
    //html.push('</form>');

    html.push('</ul>');

    return html.join("");
}
module.exports = paging;