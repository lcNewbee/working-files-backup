// "New Butterfat internationalization" (b28n.js)
//  Released under the MIT License
//  versions 3.0.0
//  $Id: b28n.js 2014-12-23 ETw $

const b28n = (function _b28n(doc, _win) {
  const STROE_KEY = 'B_LANGUAGE';
  const DEFAULT_OPTIONS = {
    supportLang: ['en', 'cn'],
    defaultLang: 'en',
  };
  const hasOwnProperty = Object.prototype.hasOwnProperty;
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
  const cookie = {
    get(name) {
      const cookieName = `${encodeURIComponent(name)}=`;
      const cookieStart = doc.cookie.indexOf(cookieName);
      let cookieEnd = doc.cookie.indexOf(';', cookieStart);
      let cookieValue = null;

      if (cookieStart > -1) {
        if (cookieEnd === -1) {
          cookieEnd = doc.cookie.length;
        }
        cookieValue = decodeURIComponent(doc.cookie.substring(cookieStart +
          cookieName.length, cookieEnd));
      }
      return cookieValue;
    },
    set(name, value, path, domain, expires, secure) {
      let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      if (expires instanceof Date) {
        cookieText += `; expires=${expires.toGMTString()}`;
      }
      if (path) {
        cookieText += `; path=${path}`;
      }
      if (domain) {
        cookieText += `; domain=${domain}`;
      }
      if (secure) {
        cookieText += `; secure=${secure}`;
      }
      /* eslint-disable no-param-reassign */
      doc.cookie = cookieText;
    },
    unset(name, path, domain, secure) {
      this.set(name, '', path, domain, new Date(0), secure);
    },
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

  function getText(val) {
    let ret = '';

    if (typeof val !== 'undefined' && val !== null) {
      if (typeof val === 'object') {
        if (JSON.stringify) {
          ret = JSON.stringify(val);
        }
      } else {
        ret = val;
      }
    }
    return ret;
  }

  function stringFormat(...args) {
    let ret = args.shift();
    let count = 0;
    let index;

    if (typeof ret !== 'string' || ret === '') {
      return '';
    }

    index = ret.indexOf('%s');

    while (index !== -1) {
      ret = ret.slice(0, index) + getText(args[count]) +
        ret.slice(index + 2);
      count = ((count + 1) === args.length) ? count : (count + 1);
      index = ret.indexOf('%s');
    }

    return ret;
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
    cookie.set(STROE_KEY, lang);
  }

  function getLangWithBrowserLocal() {
    const ret = cookie.get(STROE_KEY);

    return ret || localLang;
  }

  function objectAssign(target, ...args) {
    const ret = toObject(target, 'utils.objectAssign param target');
    const len = arguments.length;
    let i = 0;
    let key;
    let fromObj;

    for (; i < len; i += 1) {
      if (typeof args[i] === 'object') {
        fromObj = args[i];

        /* eslint-disable no-restricted-syntax */
        for (key in fromObj) {
          if (hasOwnProperty.call(fromObj, key)) {
            ret[key] = fromObj[key];
          }
        }
      }
    }

    return ret;
  }

  function extend(target, ...rest) {
    let ret = null;

    if (rest.length < 1) {
      objectAssign(this, target);
      return this;
    }

    ret = objectAssign.call(Object, target, ...rest);

    return ret;
  }

  localLang = getLangWithBrowserSetting();
  localB28n.extend = extend;
  localB28n.extend({
    version: '0.0.1',

    /**
     * Detect lang if supported
     *
     * @param {any} lang
     * @returns is support
     */
    isSupport(lang) {
      return isSupportLang(lang, localOptions.supportLang);
    },

    addDict(_dict, _lang) {
      const lang = this.isSupport(_lang) || this.getLang();
      const dict = toObject(_dict);

      if (dicts[lang]) {
        objectAssign(dicts[lang], dict);
      } else {
        dicts[lang] = objectAssign({}, dict);
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
      initOptions = objectAssign({}, DEFAULT_OPTIONS, options);

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
      ret = stringFormat.call(null, translateStr, ...rest);
    }

    return ret;
  };

  /* eslint-disable no-underscore-dangle */
  // 把 b28n 暴露到全局
  win.__ = localB28n.format;
  win.b28n = localB28n;

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

// exports
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = b28n;
}

