// 对 immutable 数据的操作

var immutableUtils = {
  getFormOptions: function(screenOptions) {
    var ret = screenOptions;

    if(!ret) {
      return null;
    }

    ret = ret.map(function(item) {
        var commonOption = {
          id: item.get('id'),
          label: item.get('text'),
        };
        var retVal = item.clear()
          .merge(commonOption)
          .merge(item.get('formProps'));

        if (item.get('noForm')) {
          retVal = 'noForm';
        }

        return retVal;
      }).filterNot(function(x) {
        return x === 'noForm'
      });
    return ret;
  }
}

// exports
if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = immutableUtils;
}
