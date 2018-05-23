/*
  异步流程控制
*/

function Step(sum, callback){
  this.sum = sum;
  this.count = 0;
  this.callback = callback;
};

Step.prototype.over = function(){
  this.count = this.count + 1;
  
  if(this.count === this.sum){
    this.callback.call(null);
  }
};

module.exports = Step;

