/*
    测试路由
*/
var router = require('express').Router();
var testLogic = require("../logic/test_logic");

router.get('/', function(req, res) {
    testLogic.p1(req, res);
});

router.get('/:i', function(req, res) {
    testLogic.p2(req, res, req.params.i);
});

//必须！！！
module.exports = router;
