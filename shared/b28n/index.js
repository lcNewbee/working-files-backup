// "New Butterfat internationalization" (b28new.js)
//  Released under the MIT License
//  versions 3.0.0
//  $Id: b28new.js 2014-12-23 ETw $
/** *********************************************************************************************
 ************************************************************************************************/
import storage from '../utils/lib/storage';
import strUtils from '../utils/lib/string';
import utilsCore from '../utils/lib/core';

const b28n = (function _b28n(doc, _win) {
  const STROE_KEY = 'B_LANGUAGE';
  const DEFAULT_OPTIONS = {
    supportLang: ['en', 'cn'],
    defaultLang: 'en',
  };
  const special = {
    zh: 'cn',
    'zh-chs': 'cn',
    'zh-cn': 'cn',
    'zh-cht': 'cn',
    'zh-hk': 'zh',
    'zh-mo': 'zh',
    'zh-tw': 'zh',
    'zh-sg': 'zh',
  };
  const win = _win;
  const dicts = {};
  const localB28n = {
    options: DEFAULT_OPTIONS,
  };

  // Local can change Config
  let localLang;
  let localOptions = DEFAULT_OPTIONS;
  let currDict;

  /**
   * find support lang in supports array
   */
  function isSupportLang(lang, supports) {
    const len = supports.length;
    let i;

    for (i = 0; i < len; i += 1) {
      if (lang === supports[i]) {
        return supports[i];
      }
    }

    return false;
  }
  function getLangWithBrowserSetting() {
    let ret = (win.navigator.language || win.navigator.userLanguage ||
        win.navigator.browserLanguage || win.navigator.systemLanguage ||
        'en').toLowerCase();

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
    storage.set(STROE_KEY, lang);
  }

  function getLangWithBrowserLocal() {
    const ret = storage.get(STROE_KEY);

    return ret || localLang;
  }

  function extend(target, ...rest) {
    let ret = null;

    if (rest.length < 1) {
      utilsCore.objectAssign(this, target);
      return this;
    }

    ret = utilsCore.objectAssign.call(Object, target, ...rest);

    return ret;
  }

  localLang = getLangWithBrowserSetting();
  localB28n.extend = extend;
  localB28n.extend({
    version: '0.0.1',

    isSupport(lang) {
      return isSupportLang(lang, localOptions.supportLang);
    },

    addDict(_dict, _lang) {
      const lang = this.isSupport(_lang) || this.getLang();
      const dict = toObject(_dict);

      if (dicts[lang]) {
        utilsCore.objectAssign(dicts[lang], dict);
      } else {
        dicts[lang] = utilsCore.objectAssign({}, dict);
      }

      return this;
    },

    getDict(_lang) {
      const lang = this.isSupport(_lang) || this.getLang();

      return dicts[lang];
    },

    setLang(_lang) {
      let lang = _lang;

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
      const defLang = localOptions.defaultLang;
      let ret = getLangWithBrowserLocal();

      ret = this.isSupport(ret) || defLang;

      return ret;
    },

    translate(str) {
      return currDict[str] || str;
    },

    init(options) {
      let initOptions = {};
      let initLang;

      // Extend options
      initOptions = utilsCore.objectAssign({}, DEFAULT_OPTIONS, options);

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
    },
  });

  // 初始化默认字典
  if (!currDict) {
    currDict = {};
    dicts[localB28n.getLang()] = {};
  }

  localB28n.format = function format(str, ...rest) {
    const translateStr = localB28n.translate(str);
    let ret;

    if (rest.length === 0) {
      ret = translateStr;
    } else {
      ret = strUtils.format.call(strUtils, translateStr, ...rest);
    }

    return ret;
  };

  win._ = localB28n.format;
  win.__ = localB28n.format;

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
    pt: 'Português', // Portugal 葡萄牙语
  };

  return localB28n;
}(document, window));

window.b28n = b28n;

export default b28n;
