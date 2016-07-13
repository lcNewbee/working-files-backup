import {expect, assert} from 'chai';

import filter from '../../lib/filter';

describe('utils', () => {

  describe('#filter()', () => {
    const connectTimefilter = filter('add:[3602]|connectTime');

    it('should handle correct', function () {
      expect(connectTimefilter.transform(86450)).to.be.equal('1d 1h')
      expect(connectTimefilter.transform(186450)).to.be.equal('2d 4h')
    });
  });

  describe('filter.connectTime()', () => {
    let connectTime = filter.helper.connectTime;

    it('should have the correct length', function () {
      expect(connectTime.length).to.be.equal(2)
    });

    it('should return 0second when time is empty', function () {
      expect(connectTime(null)).to.be.equal('0s')
      expect(connectTime(undefined)).to.be.equal('0s')
    });


    it('should return d and hour string when input greater than 1 day', function () {
      expect(connectTime(86450)).to.be.equal('1d 0h')
    });

    it('should return hour and minute string when time range: 1hour - 1day', function () {
      expect(connectTime(3601)).to.be.equal('1h 0m')
      expect(connectTime(7381)).to.be.equal('2h 3m')
    });

    it('should return minute and second unit string when time range: 1minute - 1hour', function () {
      expect(connectTime(681)).to.be.equal('11m 21s')
    });

    it('should return seconds string when time range: 1second - 1minute', function () {
      expect(connectTime(34)).to.be.equal('34s')
    });
  })
});
