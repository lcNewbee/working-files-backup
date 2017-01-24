/* eslint-disable no-unused-expressions */
import query from 'shared/utils/lib/query';

describe('utils query', () => {
  describe('#getQuery()', () => {
    it('should have the correct length', () => {
      expect(query.getQuery.length).toBe(1);
    });

    it('should throw when search is not a string', () => {
      expect(() => query.getQuery()).toThrowError(TypeError);
      expect(() => query.getQuery({})).toThrowError(TypeError);
      expect(() => query.getQuery(0)).toThrowError(TypeError);
    });

    it('should return query object', () => {
      expect(query.getQuery('?ad=ew')).toEqual({
        ad: 'ew',
      });
      expect(query.getQuery('ad=ew')).toEqual({
        ad: 'ew',
      });
      expect(query.getQuery('ad=ew&ads=ew?')).toEqual({
        ad: 'ew',
        ads: 'ew?',
      });
    });

    it('should has correct type', () => {
      expect(query.getQuery('?ad=ew&num=12')).toEqual({
        ad: 'ew',
        num: 12,
      });
      expect(query.getQuery('?ad=12')).toEqual({
        ad: 12,
      });
    });

    it('should return decode value', () => {
      expect(query.getQuery('?ad=%E5%93%AA&num=12')).toEqual({
        ad: '哪',
        num: 12,
      });
    });
  });


  describe('#queryToParamsStr()', () => {
    it('on input empty object or not object', () => {
      expect(query.queryToParamsStr()).toBe('');
      expect(query.queryToParamsStr('')).toBe('');
      expect(query.queryToParamsStr({})).toBe('');
      expect(query.queryToParamsStr(0)).toBe('');
    });

    it('on input normal object', () => {
      expect(query.queryToParamsStr({ as: 123 })).toBe('as=123');
      expect(query.queryToParamsStr({ as: 123, dd: 567 })).toBe('as=123&dd=567');
    });

    it('on input value is has 特殊 string', () => {
      expect(query.queryToParamsStr({ as: 123, dd: '哪' })).toBe('as=123&dd=%E5%93%AA');
    });
  });

  describe('#queryToJSON()', () => {
    it('on input not object', () => {
      expect(query.queryToJSON()).toBe('');
      expect(query.queryToJSON('')).toBe('');
      expect(query.queryToJSON(0)).toBe('');
    });

    it('on input normal object', () => {
      expect(query.queryToJSON({ as: 123 })).toBe('{"as":123}');
      expect(query.queryToJSON({ as: '123', dd: 567 })).toBe('{"as":"123","dd":567}');
    });

    it('on input value is has 特殊 string', () => {
      expect(query.queryToJSON({
        as: 123,
        dd: '哪',
      })).toBe('{"as":123,"dd":"%E5%93%AA"}');
    });
  });
});
