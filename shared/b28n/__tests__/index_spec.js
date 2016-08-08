/* eslint-disable import/no-extraneous-dependencies */

import { describe, it } from 'mocha';
import { expect } from 'chai';
import b28n from '../index';

describe('b28n', () => {
  it('version not empty', () => {
    expect(b28n.version !== '').to.be.equal(true);
  });

  describe('#getLang() and #setLang()', () => {
    it('should return default lang "en" when init with empty or not support lang', () => {
      b28n.setLang('');

      expect(b28n.getLang()).to.be.equal('en');
    });

    it('should return default lang "en" when init with empty or not support lang', () => {
      b28n.setLang('');
      expect(b28n.getLang()).to.be.equal('en');

      b28n.init({
        lang: 'hr',
      });

      expect(b28n.getLang()).to.be.equal('en');
    });

    it('should return default lang "en" when setLang with empty or not support lang', () => {
      b28n.setLang('');
      expect(b28n.getLang()).to.be.equal('en');
      b28n.setLang('ok');
      expect(b28n.getLang()).to.be.equal('en');
    });

    it('should return lang when setLang with support lang', () => {
      b28n.setLang('cn');

      expect(b28n.getLang()).to.be.equal('cn');
    });
  });

  describe('#addDict()', () => {
    it('should return added dict', () => {
      b28n.addDict({ adb: 'dasdds' }, 'cn');
      expect(b28n.getDict('cn').adb).to.be.equal('dasdds');
      b28n.addDict({ adb: 'dasdds' });
      expect(b28n.getDict().adb).to.be.equal('dasdds');
    });
  });

  describe('#translate()', () => {
    const testDict = {
      english: '英语',
      dict: '词典',
    };

    b28n.addDict(testDict, 'cn');
    it('should do nothing when key not in dict', () => {
      expect(b28n.translate('nothing')).to.be.equal('nothing');
    });

    it('should translate with added dict', () => {
      expect(b28n.translate('english')).to.be.equal('英语');
      b28n.setLang('en');
      expect(b28n.translate('english')).to.be.equal('english');
    });
  });

  describe('#_()', () => {
    const testDict = {
      english: '英语',
      dict: '词典',
      'This is %s and %s': '这是 %s 和 %s',
    };
    const _ = window._;
    b28n.addDict(testDict, 'cn');

    it('should do nothing when key not in dict', () => {
      expect(_('nothing')).to.be.equal('nothing');
    });

    it('should translate with added dict', () => {
      b28n.setLang('cn');
      expect(_('english')).to.be.equal('英语');
      b28n.setLang('en');
      expect(_('english')).to.be.equal('english');
    });

    it('should translate with added dict and repalce %s', () => {
      b28n.setLang('cn');
      expect(_('This is %s and %s', 12, 23)).to.be.equal('这是 12 和 23');
    });
  });
});
