/* eslint-disable no-unused-expressions */

import { expect, assert } from 'chai';
import { describe, it } from 'mocha';
import query from 'shared/utils/lib/query';

describe('utils query', () => {
  describe('#getQuery()', () => {
    it('should have the correct length', () => {
      assert.equal(query.getQuery.length, 1);
    });

    it('should throw when search is not a string', () => {
      expect(() => query.getQuery()).to.throw(TypeError);
      expect(() => query.getQuery({})).to.throw(TypeError);
      expect(() => query.getQuery(0)).to.throw(TypeError);
    });

    it('should return query object', () => {
      expect(query.getQuery('?ad=ew')).to.deep.equal({
        ad: 'ew',
      });
      expect(query.getQuery('ad=ew')).to.deep.equal({
        ad: 'ew',
      });
      expect(query.getQuery('ad=ew&ads=ew?')).to.deep.equal({
        ad: 'ew',
        ads: 'ew?',
      });
    });

    it('should has correct type', () => {
      expect(query.getQuery('?ad=ew&num=12')).to.deep.equal({
        ad: 'ew',
        num: 12,
      });
      expect(query.getQuery('?ad=12')).to.deep.equal({
        ad: 12,
      });
    });

    it('should return decode value', () => {
      expect(query.getQuery('?ad=%E5%93%AA&num=12')).to.deep.equal({
        ad: '哪',
        num: 12,
      });
    });
  });


  describe('#queryToParamsStr()', () => {
    it('on input empty object or not object', () => {
      expect(query.queryToParamsStr()).to.be.empty;
      expect(query.queryToParamsStr('')).to.be.empty;
      expect(query.queryToParamsStr({})).to.be.empty;
      expect(query.queryToParamsStr(0)).to.be.empty;
    });

    it('on input normal object', () => {
      expect(query.queryToParamsStr({ as: 123 })).to.equal('as=123');
      expect(query.queryToParamsStr({ as: 123, dd: 567 })).to.equal('as=123&dd=567');
    });

    it('on input value is has 特殊 string', () => {
      expect(query.queryToParamsStr({ as: 123, dd: '哪' })).to.equal('as=123&dd=%E5%93%AA');
    });
  });

  describe('#queryToJSON()', () => {
    it('on input not object', () => {
      expect(query.queryToJSON()).to.be.empty;
      expect(query.queryToJSON('')).to.be.empty;
      expect(query.queryToJSON(0)).to.be.empty;
    });

    it('on input normal object', () => {
      expect(query.queryToJSON({ as: 123 })).to.equal('{"as":123}');
      expect(query.queryToJSON({ as: '123', dd: 567 })).to.equal('{"as":"123","dd":567}');
    });

    it('on input value is has 特殊 string', () => {
      expect(query.queryToJSON({
        as: 123,
        dd: '哪',
      })).to.equal('{"as":123,"dd":"%E5%93%AA"}');
    });
  });
});
