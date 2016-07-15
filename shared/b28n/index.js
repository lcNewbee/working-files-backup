// "New Butterfat internationalization" (b28new.js)
//  Released under the MIT License
//	versions 3.0.0
//	$Id: b28new.js 2014-12-23 ETw $
/** *********************************************************************************************
 ************************************************************************************************/
import storage from '../utils/lib/storage';
import strUtils from '../utils/lib/string';
import utilsCore from '../utils/lib/core';

const b28n = (function (doc, win) {
  const STROE_KEY = 'B_LANGUAGE';
  const DEFAULT_OPTIONS = {
    supportLang: ['en', 'cn'],
    defaultLang: 'en',
  };
  const special = {
    'zh': 'cn',
    'zh-chs': 'cn',
    'zh-cn': 'cn',
    'zh-cht': 'cn',
    'zh-hk': 'zh',
    'zh-mo': 'zh',
    'zh-tw': 'zh',
    'zh-sg': 'zh',
  };
  const b28n = {};

  // Local Config
  let localLang = 'en';
  let localOptions = DEFAULT_OPTIONS;
  let dicts = {};
  let currDict;

  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('b28n.addDict cannot be called with null or undefined');
    }

    return Object(val);
  }

  function saveLangWithBrowserLocal(lang) {
    storage.set(STROE_KEY, lang);
  }

  function getLangWithBrowserLocal() {
    var ret = storage.get(STROE_KEY);

    return ret;
  }

  /**
   * find support lang in supports array
   */
  function isSupportLang(lang, supports) {
    var len = supports.length;
    var i;

    for (i = 0; i < len; i++) {
      if (lang === supports[i]) {
        return supports[i];
      }
    }
  }

  b28n.extend = function (target, source) {
    var len = arguments.length;
    var ret;

    if (len === 1) {
      utilsCore.objectAssign(this, target);
      return this;
    }

    ret = utilsCore.objectAssign.apply(Object, [].slice.call(arguments));

    return ret;
  };

  b28n.extend({
    version: '0.0.1',

    isSupport(lang, supports) {
      return isSupportLang(lang, localOptions.supportLang);
    },

    addDict(dict, lang) {
      lang = this.isSupport(lang) || this.getLang();
      dict = toObject(dict);

      if (dicts[lang]) {
        utilsCore.objectAssign(dicts[lang], dict);
      } else {
        dicts[lang] = utilsCore.objectAssign({}, dict);
      }

      return this;
    },

    getDict(lang) {
      lang = this.isSupport(lang) || this.getLang();

      return dicts[lang];
    },

    setLang(lang) {
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

    getOptions() {
      return localOptions;
    },

    getLang() {
      var defLang = localOptions.defaultLang;
      var local, start, end;
      var ret = getLangWithBrowserLocal() || localLang;

      return this.isSupport(ret) || defLang;
    },

    translate(str) {
      return currDict[str] || str;
    },

  });

  b28n.init = function (options) {
    let initLang;
    let initOptions = {};

    // Extend options
    utilsCore.objectAssign(initOptions, DEFAULT_OPTIONS, options);

    // init lang
    if (initOptions.lang) {
      initLang = initOptions.lang;
    } else {
      initLang = getLangWithBrowserLocal();

      if (!initLang) {
        initLang = initOptions.defaultLang;

        initLang = (win.navigator.language || win.navigator.userLanguage ||
            win.navigator.browserLanguage || win.navigator.systemLanguage ||
            initLang).toLowerCase();

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
  };

  // 初始化默认字典
  if (!currDict) {
    currDict = dicts[b28n.getLang()] = {};
  }

  win.b28n = b28n;

  win._ = function (str) {
    var translateStr = b28n.translate(str);
    var args = [].slice.call(arguments);
    var ret;

    if (arguments.length <= 1) {
      ret = translateStr;
    } else {
      args.shift();
      args.unshift(translateStr);
      ret = strUtils.format.apply(strUtils, args);
    }

    return ret;
  };

  b28n.langMap = {
		    'cn': '简体中文',
		    'zh': '繁體中文',
		    'de': 'Deutsch', // 德语
		    'en': 'English', // 英语
		    'es': 'Español', // 西班牙
		    'fr': 'Français', // 法国
		    'hu': 'Magyar', // 匈牙利
		    'it': 'Italiano', // 意大利
		    'pl': 'Polski', // 波兰
		    'ro': 'Română', // 罗马尼亚
		    'ar': 'العربية', // 阿拉伯
		    'tr': 'Türkçe', // 土耳其
		    'ru': 'Русский', // Russian	俄语
		    'pt': 'Português', // Portugal 葡萄牙语
	  };

  return b28n;
})(document, window);

export default b28n;
