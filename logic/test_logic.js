exports.p1 = function(request, response){
  response.render('index', {test: "root"});
}
exports.p2 = function(request, response, i){
  response.render('index', {test: i});
}
