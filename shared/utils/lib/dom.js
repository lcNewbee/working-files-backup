var stringUtils = require('./string');
var dom;

/**
 * 获取元素的绝对位置
 *
 * @param {Mouse Event} e 鼠标事件
 * @returns 返回当前元素的左上角，距离html的左上角的距离单位PX
 */
function getAbsPoint(e) {
  var elem = e;
  var x = e.offsetLeft;
  var y = e.offsetTop;

  elem = elem.offsetParent
  while (elem) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
    elem = elem.offsetParent
  }
  return { 'x': x, 'y': y };
}

/**
 * 把html字符串 转换为 DocumentFragment 对象
 *
 * @param {any} html html字符串
 * @returns 转换后的DocumentFragment
 */
function fragment(html) {
  var elt = document.createElement('div');
  var frag = document.createDocumentFragment();
  elt.innerHTML = html;

  while(elt.firstChild) {
    frag.appendChild(elt.firstChild);
  }

  return frag;
}

/**
 * 为Dom元素添加Classname
 *
 * @param {dom} elem 你要添加Class的dom元素
 * @param {string} addClassName 你要添加的 classname
 * @returns 返回添加新 classname 后的Dom元素
 */
function addClass(elem, addClassName) {
  var retElem = elem;

  if(retElem) {
    retElem.className = stringUtils.addClassName(retElem.className, addClassName);
  }

  return retElem;
}

/**
 * 删除Dom元素中的Classname
 *
 * @param {any} elem 你要删除Class的dom元素
 * @param {any} removeClassName 你要添删除 classname
 * @returns 返回删除 classname 后的Dom元素
 */
function removeClass(elem, removeClassName) {
  var retElem = elem;

  if(retElem) {
    retElem.className = stringUtils.removeClassName(retElem.className, removeClassName);
  }

  return retElem;
}

/**
 * 获取本地可预览的文件URL
 *
 * @param {file} file 文件对象
 * @returns 返回本地预览的图片URL
 */
function previewFile(file) {
  var retPromise = new Promise(function(resolve) {
    var retUrl = '';
    var reader = null;
    var img = null

    if (!file || typeof file === 'string') {
      resolve(retUrl);
      return retUrl;
    }

    // 如果支持 createObjectURL
    if (URL && typeof URL.createObjectURL === 'function') {
      img = new Image();
      retUrl = URL.createObjectURL(file);
      img.src = retUrl;

      img.onload =  function() {
        resolve(retUrl);
        // URL.revokeObjectURL(retUrl);
      };

    // 如果支持 FileReader
    } else if (window.FileReader) {
      reader = new FileReader();
      reader.onload = function(e) {
        retUrl = e.target.result;
        resolve(retUrl);
      };
      reader.readAsDataURL(file);

    // 其他放回 Flase
    } else {
      resolve(retUrl);
    }
  });

  return retPromise;
}

dom = {
  getAbsPoint: getAbsPoint,
  fragment: fragment,
  addClass: addClass,
  removeClass: removeClass,
  previewFile: previewFile
}
// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = dom;
}
