import {expect, assert} from 'chai';

import filter from '../../lib/filter';

describe('utils', () => {
  
  describe('#filter()', () => {
    const connectTimefilter = filter('add:[3602]|connectTime');
    
    it('should handle correct', function () {
      expect(connectTimefilter.transform(86450)).to.be.equal('1天，1小时')
    });
  });

  describe('filter.connectTime()', () => {
    let connectTime = filter.helper.connectTime;

    it('should have the correct length', function () {
      expect(connectTime.length).to.be.equal(2)
    });

    it('should throw when str is not string or number', function () {
      assert.throws(function () {
        connectTime(null);
      }, TypeError);
      assert.throws(function () {
        connectTime(undefined);
      }, TypeError);
      assert.throws(function () {
        connectTime({});
      }, TypeError);
    });


    it('should return day and hour string when input greater than 1 day', function () {
      expect(connectTime(86450)).to.be.equal('1天，0小时')
    });

    it('should return hour and minute string when time range: 1hour - 1day', function () {
      expect(connectTime(3601)).to.be.equal('1小时，0分钟')
      expect(connectTime(3681)).to.be.equal('1小时，1分钟')
    });

    it('should return minute and second unit string when time range: 1minute - 1hour', function () {
      expect(connectTime(681)).to.be.equal('11分钟，21秒')
    });

    it('should return seconds string when time range: 1second - 1minute', function () {
      expect(connectTime(34)).to.be.equal('34秒')
    });
  })
});