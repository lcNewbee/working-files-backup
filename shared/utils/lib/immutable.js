// 对 immutable 数据的操作

function warning(msg) {
  /* eslint-disable no-console */
  if (console && typeof console.error === 'function') {
    console.error('Warning: ', msg);
  }

  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(msg)
  /* eslint-disable no-empty */
  } catch (e) { }
}

function isImmutableList($$list) {
  return $$list && $$list.constructor && typeof $$list.constructor.isList === 'function';
}
function isImmutableMap($$list) {
  return $$list && $$list.constructor && typeof $$list.constructor.isMap === 'function';
}

var immutableUtils = {
  getFormOptions: function ($$options) { // 构造表格项的编辑内容
    var ret = $$options;

    if (!isImmutableList(ret)) {
      return null;
    }

    ret = ret.map(function (item) {
        var commonOption = {
          id: item.get('id'),
          linkId: item.get('linkId'),
          label: item.get('text') || item.get('label'),
          fieldset: item.get('fieldset'),
          fieldsetOption: item.get('fieldsetOption'),
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
      .filterNot(function (x) { // listOptions中又不需要编辑的项目则添加该bool值
        return x === 'noForm';
      })
      .groupBy(function (item) { // 使用fieldset分组
        return item.get('fieldset')
      })
      .toList();

    // 如果只有一组,则直接获取第一组List
    if (ret.size === 1) {
      ret = ret.get(0);
    }
    return ret;
  },

  /**
   * 获取默认值对象
   *
   * $$options(List)  配置集合
   * $$options(String)  默认值的名称，默认 ‘defaultValue’
   *
   * return Object
   */
  getDefaultData: function ($$options, key) {
    var defaultKey = key || 'defaultValue';
    var ret = {};

    if (!isImmutableList($$options)) {
      warning('immutableUtils.getDefaultData param need immutable.js List data');
      return null;
    }

    function fillRet($$item) {
      var defaultVal = $$item.get(defaultKey);

      if (typeof defaultVal === undefined) {
        defaultVal = $$item.getIn(['formProps', defaultKey]);
      }

      // 如果是列表继续循环
      if (isImmutableList($$item)) {
        $$item.forEach(function($$subItem) {
          fillRet($$subItem);
        })
      } else if (defaultVal !== undefined) {
        ret[$$item.get('id')] = defaultVal;
      }
    }

    // 初始化默认值对象
    fillRet($$options);

    return ret;
  },

  /**
   *
   */
  getNumberKeys: function($$options) {
    var ret = [];

    if(!isImmutableList($$options)) {
      return ret;
    }

    function walkList($$list) {
      var curId;
      var linkId;

      // 如果是 List 类型
      if (isImmutableList($$list)) {
        $$list.forEach(
          function($$item) {
            walkList($$item);
          }
        );

      // 如果是数字类型对象
      } else if ($$list.get('dataType') === 'number') {
        curId = $$list.get('id');
        linkId = $$list.get('linkId');

        ret.push(curId);

        if(linkId) {
          ret.push(linkId);
        }
      }
    }

    walkList($$options)

    return ret;
  },

  /**
   *
   */
  getTableOptions: function ($$options) {
    var ret = $$options;

    if (!isImmutableList(ret)) {
      return null;
    }

    ret = ret.map(function($$item) {
      return $$item.delete('formProps')
    }).filterNot(function($$item) {
      return $$item.get('noTable');
    })
    return ret;
  },

  getChanged: function ($$newData, $$oldData) {
    var $$ret = $$newData;

    if (!isImmutableMap($$newData) || !isImmutableMap($$newData)) {
      return null;
    }

    $$ret = $$newData.filter(
      function(val, key) {
        var ret = false;
        var oldVal = $$oldData.get(key);

        if (oldVal !== undefined && oldVal !== val) {
          ret = true;
        }

        return ret;
      }
    );

    return $$ret;
  },


  selectList: function($$list, data, $$selectedList) {
    if(!isImmutableList($$list) || !data) {
      warning('immutableUtils.selectList need params $$list and data');
      return null;
    }
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
      selectedList = $$retList.clear();
      if (data.selected) {
        $$retList = $$retList.map(function(item, index) {
          selectedList = selectedList.push(index);

          return item.set('__selected__', true);
        });
      } else {
        $$retList = $$retList.map(function(item) {
          return item.set('__selected__', false)
        });
      }
    }

    return {
      $$list: $$retList,
      selectedList: selectedList
    };
  },

  toNumberWithKeys: function($$data, $$keysArr) {
    var $$ret = $$data;

    if ($$ret) {
      $$keysArr.forEach(
        function(key) {
          var curVal = $$ret.get(key);

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
