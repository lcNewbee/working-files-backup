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

dom = {
  getAbsPoint: getAbsPoint,
  fragment: fragment
}
// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = dom;
}
