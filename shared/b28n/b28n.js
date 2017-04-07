'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _storage = require('../utils/lib/storage');

var _storage2 = _interopRequireDefault(_storage);

var _string = require('../utils/lib/string');

var _string2 = _interopRequireDefault(_string);

var _core = require('../utils/lib/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var b28n = function _b28n(doc, _win) {
  var STROE_KEY = 'B_LANGUAGE';
  var DEFAULT_OPTIONS = {
    supportLang: ['en', 'cn'],
    defaultLang: 'en'
  };
  var special = {
    zh: 'cn',
    'zh-chs': 'cn',
    'zh-cn': 'cn',
    'zh-cht': 'cn',
    'zh-hk': 'zh',
    'zh-mo': 'zh',
    'zh-tw': 'zh',
    'zh-sg': 'zh'
  };
  var win = _win;
  var dicts = {};
  var localB28n = {
    options: DEFAULT_OPTIONS
  };

  // Local can change Config
  var localLang = void 0;
  var localOptions = DEFAULT_OPTIONS;
  var currDict = void 0;

  /**
   * find support lang in supports array
   */
  function isSupportLang(lang, supports) {
    var len = supports.length;
    var i = void 0;

    for (i = 0; i < len; i += 1) {
      if (lang === supports[i]) {
        return supports[i];
      }
    }

    return false;
  }
  function getLangWithBrowserSetting() {
    var ret = (win.navigator.language || win.navigator.userLanguage || win.navigator.browserLanguage || win.navigator.systemLanguage || 'en').toLowerCase();

    ret = special[ret] || ret.split('-')[0].toString();
    ret = isSupportLang(ret, localB28n.options.supportLang) || 'en';

    return ret;
  }

  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('b28n.addDict cannot be called with null or undefined');
    }

    return Object(val);
  }

  function saveLangWithBrowserLocal(lang) {
    _storage2.default.set(STROE_KEY, lang);
  }

  function getLangWithBrowserLocal() {
    var ret = _storage2.default.get(STROE_KEY);

    return ret || localLang;
  }

  function extend(target) {
    var _utilsCore$objectAssi;

    var ret = null;

    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    if (rest.length < 1) {
      _core2.default.objectAssign(this, target);
      return this;
    }

    ret = (_utilsCore$objectAssi = _core2.default.objectAssign).call.apply(_utilsCore$objectAssi, [Object, target].concat(rest));

    return ret;
  }

  localLang = getLangWithBrowserSetting();
  localB28n.extend = extend;
  localB28n.extend({
    version: '0.0.1',

    isSupport: function isSupport(lang) {
      return isSupportLang(lang, localOptions.supportLang);
    },
    addDict: function addDict(_dict, _lang) {
      var lang = this.isSupport(_lang) || this.getLang();
      var dict = toObject(_dict);

      if (dicts[lang]) {
        _core2.default.objectAssign(dicts[lang], dict);
      } else {
        dicts[lang] = _core2.default.objectAssign({}, dict);
      }

      return this;
    },
    getDict: function getDict(_lang) {
      var lang = this.isSupport(_lang) || this.getLang();

      return dicts[lang];
    },
    setLang: function setLang(_lang) {
      var lang = _lang;

      if (lang !== undefined) {
        lang = special[lang] || lang;

        if (!this.isSupport(lang)) {
          lang = localOptions.defaultLang;
        }

        saveLangWithBrowserLocal(lang);
        localLang = lang;
        currDict = dicts[lang] || {};
      }

      return this;
    },
    getOptions: function getOptions() {
      return localOptions;
    },
    getLang: function getLang() {
      var defLang = localOptions.defaultLang;
      var ret = getLangWithBrowserLocal();

      ret = this.isSupport(ret) || defLang;

      return ret;
    },
    translate: function translate(str) {
      return currDict[str] || str;
    },
    init: function init(options) {
      var initOptions = {};
      var initLang = void 0;

      // Extend options
      initOptions = _core2.default.objectAssign({}, DEFAULT_OPTIONS, options);

      // init lang
      if (initOptions.lang) {
        initLang = initOptions.lang;
      } else {
        initLang = getLangWithBrowserLocal();

        if (!initLang) {
          initLang = initOptions.defaultLang;

          initLang = (win.navigator.language || win.navigator.userLanguage || win.navigator.browserLanguage || win.navigator.systemLanguage || initLang).toLowerCase();

          initLang = special[initLang] || initLang.split('-')[0].toString();
        }
      }

      initLang = isSupportLang(initLang, initOptions.supportLang) || initOptions.defaultLang;

      // 把初始化的语言保存在本地
      saveLangWithBrowserLocal(initLang);

      localLang = initLang;
      currDict = dicts[localLang] || {};

      localOptions = initOptions;

      return this;
    }
  });

  // 初始化默认字典
  if (!currDict) {
    currDict = {};
    dicts[localB28n.getLang()] = {};
  }

  localB28n._ = function __(str) {
    var translateStr = localB28n.translate(str);
    var ret = void 0;

    for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    if (rest.length === 0) {
      ret = translateStr;
    } else {
      var _strUtils$format;

      ret = (_strUtils$format = _string2.default.format).call.apply(_strUtils$format, [_string2.default, translateStr].concat(rest));
    }

    return ret;
  };

  win._ = localB28n._;
  win.__ = localB28n._;

  localB28n.langMap = {
    cn: '简体中文',
    zh: '繁體中文',
    de: 'Deutsch', // 德语
    en: 'English', // 英语
    es: 'Español', // 西班牙
    fr: 'Français', // 法国
    hu: 'Magyar', // 匈牙利
    it: 'Italiano', // 意大利
    pl: 'Polski', // 波兰
    ro: 'Română', // 罗马尼亚
    ar: 'العربية', // 阿拉伯
    tr: 'Türkçe', // 土耳其
    ru: 'Русский', // 俄语
    pt: 'Português' };

  // Portugal 葡萄牙语
  return localB28n;
}(document, window); // "New Butterfat internationalization" (b28new.js)
//  Released under the MIT License
//  versions 3.0.0
//  $Id: b28new.js 2014-12-23 ETw $
/** *********************************************************************************************
 ************************************************************************************************/


window.b28n = b28n;

exports.default = b28n;
