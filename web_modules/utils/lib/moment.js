var _moment = {
  time: new Date(),

  fromNow: function() {
    var now = new Date();

    return this.form(new Date)
  },

  format: function(fmt) {
    var thisTime = this.time;
    var o = {
      "M+": thisTime.getMonth() + 1, //月份
      "d+": thisTime.getDate(), //日
      "h+": thisTime.getHours(), //小时
      "m+": thisTime.getMinutes(), //分
      "s+": thisTime.getSeconds(), //秒
      "q+": Math.floor((thisTime.getMonth() + 3) / 3), //季度
      "S": thisTime.getMilliseconds() //毫秒
    };
    var isYear = /(y+)/;

    if (isYear.test(fmt))
      fmt = fmt.replace(RegExp.$1, (thisTime.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
              (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
    return fmt;
  },

  isToday: function(time) {
    var now = new Date();
    var newDate = new Date(time);

    if(newDate.getYear() === now.getYear() &&
        newDate.getMonth() === now.getMonth() &&
        newDate.getDate() === now.getDate()) {

      return true;
    }

    return false;
  }
};

function moment(time) {

  if (time) {
    _moment.time = new Date(time) || new Date();
  } else {
    _moment.time = new Date();
  }

  return _moment;
};

module.exports = moment;
