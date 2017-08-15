// 职责链对象构造函数
var Chain = function (fn) {
  this.fn = fn;
  this.successor = null;
};

Chain.prototype.setNextSuccessor = function (successor) {
  this.successor = successor;
};

Chain.prototype.passRequest = function () {
  var ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
};

// 将函数转化成职责链函数要求的形式
function changeFuncStyle(fn) {
  return function () {
    var str = fn.apply(this, arguments);
    if (str) return str;
    return 'nextSuccessor';
  }
}

function generateChainStartFunc(fnArr) {
  // 利用函数生成职责链对象，并存放在数组中
  var chainObjArr = fnArr.map(function (fn) {
    var newFn = changeFuncStyle(fn);
    return new Chain(newFn);
  });
  var len = chainObjArr.length;
  // 按照数组顺序生成职责链
  for (var i = 0; i < len - 1; i++) {
    chainObjArr[i].setNextSuccessor(chainObjArr[i+1]);
  }
  // 返回职责链开始执行的函数，即链条的开端
  return function () {
    return chainObjArr[0].passRequest.apply(chainObjArr[0], arguments);
  }
}

// exports
if (typeof module === 'object' &&
  typeof module.exports === 'object') {
  module.exports = generateChainStartFunc;
}

/**
 *1. generateChainStartFunc接收一个函数数组作为参数，返回一个函数，该函数是职责链执行的开始函数。
 *2. 函数数组中的函数，如果无需继续向下执行职责链，则返回一个字符串，或真值。
 *   若返回假值，则函数继续沿着数组的顺序（数组的顺序就是职责链的顺序）继续向下执行
 */

 /**
  * 使用示例
  * 用于保存数据之前的各种组合数据验证，若有错误则返回错误，没有则返回一个假值表示没有错误。
  * import generateChainStartFunc from '.../.../Chain';
  * var validateFunc = generateChainStartFunc([fn1,fn2,fn3,...]) // fn*有错误返回错误信息字符串，无错误则返回一个假值
  * var errorMsg = validateFunc(/..arguments../); // errorMsg就是第一个出错位置的错误信息
  */
