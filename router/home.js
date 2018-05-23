/*
    主页
*/
var router = require('express').Router();
var homeLogic = require("../logic/home_logic");

router.get('/', function(req, res) {
    homeLogic.index(req, res);
});

router.get('/:i', function(req, res) {
    console.log("router.get('/:i'): %s", req.params.i);
    if(req.params.i=="index.html"){
        homeLogic.index(req, res);
    }else {
        homeLogic.p2(req, res, req.params.i);
    }
});
//必须！！！
module.exports = router;
