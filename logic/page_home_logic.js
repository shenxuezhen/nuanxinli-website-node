var Request = require('request');

exports.build = function(request, response){
  
  Request.get({
    url: 'http://psycholate.imeap.com/agent/sift/todaylist'
  }, function(error, response, body){
    console.log(body);
    response.render('index', {test: "xxx"});
  });
  

//  Request.post({
//    headers: {'content-type' : 'text/plain'},
//    url:     'http://localhost/test2.php',
//    body:    "{}"
//  }, function(error, response, body){
//    console.log(body);
//  });

  
  
}