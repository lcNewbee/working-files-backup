var validateType = {};

var typeArr = ['String', 'Array', 'Function', 'Number', 'Undefined', 'Null', 'Boolean', 'Object'];

for (var i = 0; i < typeArr.length; i++) {
  var type = typeArr[i];
  (function(t){
    validateType['is' + t] = function(obj) {
      return Object.prototype.toString.call(obj) === '[Object ' + t + ']';
    }
  })(type)
}

if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = validateType;
}
