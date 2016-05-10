import { expect } from 'chai';

import string from '../../lib/string';

describe('utils string', () => {
  describe('#prefixInteger()', () => {
    it('on input not string or number, return empty', () => {
      expect(string.prefixInteger({ as: 123 })).to.be.empty;
      expect(string.prefixInteger(function() {})).to.be.empty;
      expect(string.prefixInteger(new RegExp())).to.be.empty;
      expect(string.prefixInteger()).to.be.empty;
    });

    it('on input not param length ro length < number length', () => {
      expect(string.prefixInteger(12)).to.equal('12');
      expect(string.prefixInteger(12, 1)).to.equal('12');
    });

    it('on input normal params', () => {
      expect(string.prefixInteger(12, 5)).to.equal('00012');
      expect(string.prefixInteger(12, 4)).to.equal('0012');
    });
  });

  describe('#toCamel()', () => {
    it('on input not string or empty, return empty', () => {
      expect(string.toCamel({ as: 123 })).to.be.empty;
      expect(string.toCamel(function() {})).to.be.empty;
      expect(string.toCamel(new RegExp())).to.be.empty;
      expect(string.toCamel()).to.be.empty;
      expect(string.toCamel('')).to.be.empty;
    });

    it('on input normal word', () => {
      expect(string.toCamel('work')).to.equal('Work');
      expect(string.toCamel('_work')).to.equal('_work');
    });
  });

  describe('#format()', () => {
    it('on input first param not string or empty', () => {
      expect(string.format({ as: 123 })).to.be.empty;
      expect(string.format(function() {})).to.be.empty;
      expect(string.format(new RegExp())).to.be.empty;
      expect(string.format()).to.be.empty;
      expect(string.format('')).to.be.empty;
    });

    it('on input after first param is object', () => {
      expect(string.format('%swork%%%%sdas%s', 123, "=", new Date('2016-04-08T03:17:01.169Z'))).to.equal('123work%%%=das"2016-04-08T03:17:01.169Z"');
      expect(string.format('%swork%%%%sdas%s', 123, "=", {})).to.equal('123work%%%=das{}');
    });

    it('on input two or more params', () => {
      expect(string.format('work %s', 123)).to.equal('work 123');
      expect(string.format('work', 123)).to.equal('work');
      expect(string.format('%swork%%%%sand%s', 123, "=", '%s')).to.equal('123work%%%=and%s');
    });
  });

  describe('#isInteger()', () => {
    it('on input int number', () => {
      expect(string.isInteger(123)).to.be.true;
    });

    it('on input empty', () => {
      expect(string.isInteger()).to.be.false;
      expect(string.isInteger('')).to.be.false;
    });

    it('on input not isInteger string', () => {
      expect(string.isInteger('223d')).to.be.false;
      expect(string.isInteger('32.23')).to.be.false;
      expect(string.isInteger('.32')).to.be.false;
      expect(string.isInteger('0.23')).to.be.false;
    });

    it('on input normal int number string', () => {
      expect(string.isInteger('123')).to.be.true;
    });
  });

  describe('#isNumber()', () => {
    it('on input int', () => {
      expect(string.isNumber(123)).to.be.true;
    });

    it('on input float', () => {
      expect(string.isNumber(0.23)).to.be.true;
    });

    it('on input empty', () => {
      expect(string.isNumber()).to.be.false;
      expect(string.isNumber('')).to.be.false;
      expect(string.isNumber({})).to.be.false;
    });

    it('on input not number string', () => {
      expect(string.isNumber('223d')).to.be.false;
      expect(string.isNumber('.32')).to.be.false;
    });

    it('on input normal int number string', () => {
      expect(string.isNumber('123')).to.be.true;
    });

    it('on input float string', () => {
      expect(string.isNumber('0.13')).to.be.true;
    })
  });

  describe('#isAscii()', () => {
   
    it('on input empty', () => {
      expect(string.isAscii('')).to.be.false;
      expect(string.isAscii()).to.be.false;
    });

    it('on input not sting and number', () => {
      expect(string.isAscii({})).to.be.false;
      expect(string.isAscii(function(){})).to.be.false;
    });

    it('on input not ascii string', () => {
      expect(string.isAscii('申请')).to.be.false;
    });

    it('on input normal ascii string', () => {
      expect(string.isAscii('~!@#$%^&*()_+')).to.be.true;
    });
  });

});
