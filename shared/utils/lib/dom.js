var stringUtils = require('./string');
var dom;

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

function fragment(html) {
  var elt = document.createElement('div');
  var frag = document.createDocumentFragment();
  elt.innerHTML = html;

  while(elt.firstChild) {
    frag.appendChild(elt.firstChild);
  }

  return frag;
}

function addClass(elem, addClassName) {
  var retElem = elem;

  if(retElem) {
    retElem.className = stringUtils.addClassName(retElem.className, addClassName);
  }

  return retElem;
}
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

function removeClass(elem, removeClassName) {
  var retElem = elem;

  if(retElem) {
    retElem.className = stringUtils.removeClassName(retElem.className, removeClassName);
  }

  return retElem;
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
