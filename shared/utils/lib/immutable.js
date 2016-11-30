// 对 immutable 数据的操作

var immutableUtils = {
  getFormOptions: function ($$options) {
    var ret = $$options;

    if (!ret) {
      return null;
    }

    ret = ret.map(function (item) {
        var commonOption = {
          id: item.get('id'),
          label: item.get('text') || item.get('label'),
          fieldset: item.get('fieldset'),
          legend: item.get('legend'),
          options: item.get('options'),
          notEditable: item.get('notEditable'),
        };
        var retVal = item.clear()
          .merge(commonOption)
          .merge(item.get('formProps'))
          .filterNot(function (val) {
            return typeof val === 'undefined';
          });

        if (item.get('noForm')) {
          retVal = 'noForm';
        }

        return retVal;
      })
      .filterNot(function (x) {
        return x === 'noForm';
      })
      .groupBy(function (item) {
        return item.get('fieldset')
      })
      .toList();

    // 如果只有一组,则直接获取第一组List
    // if (ret.size === 1) {
    //   ret = ret.get(0);
    // }
    return ret;
  },

  getQueryFormOptions: function ($$options) {
    var ret = $$options;

    if (!ret) {
      return null;
    }

    ret = ret.filter(function (x) {
        return x.get('queryable');
      }).map(function (item) {
        var commonOption = {
          id: item.get('id'),
          label: item.get('text') || item.get('label'),
          fieldset: item.get('fieldset'),
          legend: item.get('legend'),
          options: item.get('options'),
        };
        var retVal = item.clear()
          .merge(commonOption)
          .merge(item.get('formProps'));

        return retVal;
      })
      .toList();

    return ret;
  },

  getDefaultData: function ($$options, key) {
    var defaultKey = key || 'defaultValue';
    var ret = {};

    function fillRet($$item) {
      var defaultVal = $$item.get(defaultKey);

      // 如果是列表继续循环
      if (typeof $$item.findIndex === 'function') {
        $$item.forEach(function($$subItem) {
          fillRet($$subItem);
        })
      } else if (defaultVal !== undefined) {
        ret[$$item.get('id')] = defaultVal;
      }
    }

    if (!$$options) {
      return null;
    }

    // 初始化默认值对象
    $$options.forEach(fillRet);
    return ret;
  },

  getNumberKeys: function($$options) {
    var $$ret = [];

    if(!$$options || ($$options && !$$options.clear)) {
      return $$ret;
    }

    $$ret = $$options.clear();

    $$options.forEach(
      function(item) {
        var curId = item.get('id')
        var dataType = item.get('dataType');
        if (dataType === 'number') {
          $$ret.push(curId);
        }
      }
    );

    return $$ret;
  },

  getValidatorOptions: function ($$options) {
    var ret = $$options;

    if (!ret) {
      return null;
    }

    ret = ret.map(
      function(item) {
        return item.delete('formProps')
      }
    ).filterNot((item) => item.get('noTable'));

    return ret;
  },

  getTableOptions: function ($$options) {
    var ret = $$options;

    if (!ret) {
      return null;
    }

    ret = ret.map(
      (item) => item.delete('formProps')
    ).filterNot((item) => item.get('noTable'));

    return ret;
  },

  selectList: function($$list, data, $$selectedList) {
    var $$retList = $$list;
    var selectedList = $$selectedList || $$retList.clear();

    if (data.index !== -1) {
      $$retList = $$retList.setIn([data.index, '__selected__'], data.selected);
      if (data.selected) {
        selectedList = selectedList.push(data.index);
      } else {
        selectedList = selectedList.delete(data.index);
      }
    } else {
      if (data.selected) {
        $$retList = $$retList.map((item, index) => {
          selectedList = selectedList.push(index);

          return item.set('__selected__', true);
        });
      } else {
        $$retList = $$retList.map(item => item.set('__selected__', false));
      }
    }

    return {
      $$list: $$retList,
      selectedList,
    }
  },

  getChanged: function ($$newData, $$oldData) {
    var $$ret = $$newData;

    $$ret = $$newData.filter(
      (val, key) => {
        let ret = false;
        const oldVal = $$oldData.get(key);

        if (oldVal !== undefined && oldVal !== val) {
          ret = true;
        }

        return ret;
      },
    );

    return $$ret;
  },

  /**
   *
   */
  toNumberWithKeys: function($$data, $$keysArr) {
    var $$ret = $$data;

    if ($$ret) {
      $$keysArr.forEach(
        (key) => {
          const curVal = $$ret.get(key);
          if (curVal !== undefined) {
            $$ret = $$ret.set(key, parseInt(curVal));
          }
        }
      );
    }

    return $$ret;
  }
}

// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = immutableUtils;
}
