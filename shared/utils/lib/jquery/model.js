// 有关处理，model数据 与 HTML 内容同步
var model = {};

function setValues($modelElem, val) {
  var thisModel = $modelElem.data('model');
  var thisType = $modelElem.attr('type');

  // 如果model元素是 input
  if ($modelElem.is('input')) {

    if(thisType !== 'radio' && thisType !== 'checkbox') {
      $modelElem.val(val);

    // radio, checkbox
    } else if (thisType == 'checkbox') {

      if(val == ($modelElem.val() || '1')) {
        $modelElem.attr('checked', true);

      } else {
        $modelElem.removeAttr('checked');
      }

    } else {

      if(val == $modelElem.val()) {
        $modelElem[0].checked = true;
      } else {
        $modelElem.removeAttr('checked');
      }
    }

  // 如果model元素不是输出类型
  } else {

    // 如果没有 data-val 属性，直接设置text
    if(!$modelElem.data('val')) {
      $modelElem.text(val);

    // 如果有 data-val 属性，需特殊处理
    } else {
      $modelElem.data('val', val);
    }
  }
}

/**
 * 获取作用域内的 model元素的值
 *
 * @param  {String | jQueryElem} content 作用域的CSS选择器，或jQuery元素
 * @return {Object}         域内的 model元素的值的对象
 */
model.get = function(content) {
  var $contents = $(content);
  var ret = {};

  $contents.find('[data-model]').each(function(){
    var $this = $(this);
    var thisModel = $this.data('model');
    var thisType = $this.attr('type');
    var thisVal;

    if ($this.is('input') || $this.is('select')) {

      if(thisType !== 'radio' && thisType !== 'checkbox') {
        thisVal = $this.val();

      } else {

        // 如果是选中状态
        if(this.checked) {
          thisVal = this.value || '1';

        // 如果是未选中
        } else {
          if (thisType === 'checkbox') {
            thisVal = '0';
          }
        }
      }
    } else {
      if(typeof $this.data('val') !== void 0) {
        thisVal = $this.data('val');
      } else {
        thisVal = $this.text();
      }
    }
    if ($.type(thisVal) !== 'undefined') {
      ret[thisModel] = thisVal;
    }
  });
  return ret;
}

/**
 * [set description]
 * @param {[type]} model [description]
 */
model.set = function (model, content) {
  var $contents = content ? $(content) : $(document);

  $.each(model, function(key, val) {
    var $modelElem = $contents.find('[data-model="' + key + '"]');

    // 如果能找到HTML 中对于的model元素
    if ($modelElem.length === 1) {
      setValues($modelElem, val);

    } else if ($modelElem.length > 1) {
      $modelElem.each(function() {
        setValues($(this), val);
      });
    }
  });
}

module.exports = model;
