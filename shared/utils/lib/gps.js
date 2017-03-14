var gps = null;

function getOffsetFromGpsPoint(gpsPoint, mapItem) {
  var xMeter = (gpsPoint.lng - mapItem.lng) * 100000;
  var yMeter = (gpsPoint.lat - mapItem.lat) * 110000;
  var ret = {};

  ret.x = Number((xMeter / mapItem.length) * 100).toFixed(4);
  ret.y = Number((yMeter / mapItem.width) * 100).toFixed(4);

  ret.x = Math.abs(parseFloat(ret.x));
  ret.y = Math.abs(parseFloat(ret.y));

  return ret;
}

function getGpsPointFromOffset(offset, mapItem) {
  var lng = (mapItem.length * offset.x) / 100;
  var lat = (mapItem.width * offset.y) / 110;
  var ret = {};

  ret.lng = Number(mapItem.lng + (lng / 100000)).toFixed(12);
  ret.lat = Number(mapItem.lat + (lat / 100000)).toFixed(12);

  ret.lng = parseFloat(ret.lng);
  ret.lat = parseFloat(ret.lat);

  return ret;
}

gps = {
  getOffsetFromGpsPoint: getOffsetFromGpsPoint,
  getGpsPointFromOffset: getGpsPointFromOffset,
};

// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = gps;
}


