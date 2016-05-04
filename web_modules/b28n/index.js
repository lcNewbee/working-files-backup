// "New Butterfat internationalization" (b28new.js)
//  Released under the MIT License
//	versions 3.0.0
//	$Id: b28new.js 2014-12-23 ETw $
/***********************************************************************************************
 ************************************************************************************************/
const doc = document;
const win = window;
const b28n = function(options) {
  return new b28n.fn.init(options);
};

b28n.fn = b28n.prototype = {
  constructor: b28n,

  isSupport(lang) {
    var support = this.options.support;
    var len = support.length;
    var i;

    for (i = 0; i < len; i++) {
      if (lang === support[i]) {
        return support[i];
      }
    }
  },

  setLang(lang) {
    if (lang !== undefined) {

      if (!this.isSupport(lang)) {
        lang = this.options.defaultLang;
      }
      doc.cookie = "bLanguage=" + lang + ";";
    }
    return lang;
  },

  getLang() {
    var special = {
        "zh": "cn",
        "zh-chs": "cn",
        "zh-cn": "cn",
        "zh-cht": "cn",
        "zh-hk": "zh",
        "zh-mo": "zh",
        "zh-tw": "zh",
        "zh-sg": "zh"
      };
    var defLang = this.options.defaultLang,
    var local, ret, start, end;

    if ((doc.cookie.indexOf("bLanguage=")) === -1) {
      local = (win.navigator.language || win.navigator.userLanguage ||
          win.navigator.browserLanguage || win.navigator.systemLanguage ||
          defLang).toLowerCase();

      ret = special[local] || local.split("-")[0].toString();
    } else {
      if (doc.cookie.indexOf("bLanguage=") === 0) {
        start = 10;

        //incase there has cookie like: **bLanguage=cn
      } else if (doc.cookie.indexOf("; bLanguage=") !== -1) {
        start = doc.cookie.indexOf("; bLanguage=") + 12;
      }

      if (start !== undefined) {
        end = (doc.cookie.indexOf(';', start) !== -1) ?
          doc.cookie.indexOf(';', start) : doc.cookie.length;
        ret = doc.cookie.substring(start, end);
      }
    }

    return this.isSupport(ret) || this.options.defaultLang;
  }

};
const init = b28n.fn.init = function(options) {
  let defaultOptions = {
    supportLang: ["en", "zh"],
    defaultLang: 'en'
  };
  this.options = {};

  Object.assign(this.options, defaultOptions, options);

  return this;
}

init.prototype = b28n.fn;

export default b28n;
