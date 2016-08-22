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
          fieldset: item.get('fieldset'),
          legend: item.get('legend'),
        };
        var retVal = item.clear()
          .merge(commonOption)
          .merge(item.get('formProps'));

        if (item.get('noForm')) {
          retVal = 'noForm';
        }

        return retVal;
      })
      .filterNot(function(x) {
        return x === 'noForm'
      })
      .groupBy((item) => item.get('fieldset'))
      .toList();

    return ret;
  },

  getTableOptions: function(screenOptions) {
    var ret = screenOptions;

    if(!ret) {
      return null;
    }

    ret = ret.map(
      (item) => item.delete('formProps')
    ).filterNot((item) => item.get('noTable'));

    return ret;
  }
}

// exports
if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = immutableUtils;
}
