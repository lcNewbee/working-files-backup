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

dom = {
  getAbsPoint: getAbsPoint
}
// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = dom;
}
