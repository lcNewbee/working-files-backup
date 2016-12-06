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
}
// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = dom;
}
