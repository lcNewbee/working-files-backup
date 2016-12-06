/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import stringUtils from 'shared/utils/lib/string';

describe('utils string', () => {
  describe('#prefixInteger()', () => {
    it('on input not string or number, return empty', () => {
      expect(stringUtils.prefixInteger({ as: 123 })).to.be.empty;
      expect(stringUtils.prefixInteger(() => {})).to.be.empty;
      expect(stringUtils.prefixInteger(new RegExp())).to.be.empty;
      expect(stringUtils.prefixInteger()).to.be.empty;
    });

    it('on input not param length ro length < number length', () => {
      expect(stringUtils.prefixInteger(12)).to.equal('12');
      expect(stringUtils.prefixInteger(12, 1)).to.equal('12');
    });

    it('on input normal params', () => {
      expect(stringUtils.prefixInteger(12, 5)).to.equal('00012');
      expect(stringUtils.prefixInteger(12, 4)).to.equal('0012');
    });
  });

  describe('#toCamel()', () => {
    it('on input not string or empty, return empty', () => {
      expect(stringUtils.toCamel({ as: 123 })).to.be.empty;
      expect(stringUtils.toCamel(() => {})).to.be.empty;
      expect(stringUtils.toCamel(new RegExp())).to.be.empty;
      expect(stringUtils.toCamel()).to.be.empty;
      expect(stringUtils.toCamel('')).to.be.empty;
    });

    it('on input normal word', () => {
      expect(stringUtils.toCamel('work')).to.equal('Work');
      expect(stringUtils.toCamel('_work')).to.equal('_work');
    });
  });

  describe('#format()', () => {
    it('on input first param not string or empty', () => {
      expect(stringUtils.format({ as: 123 })).to.be.empty;
      expect(stringUtils.format(() => {})).to.be.empty;
      expect(stringUtils.format(new RegExp())).to.be.empty;
      expect(stringUtils.format()).to.be.empty;
      expect(stringUtils.format('')).to.be.empty;
    });

    it('on input after first param is object', () => {
      expect(stringUtils.format('%swork%%%%sdas%s', 123, '=', new Date('2016-04-08T03:17:01.169Z')))
        .to.equal('123work%%%=das"2016-04-08T03:17:01.169Z"');
      expect(stringUtils.format('%swork%%%%sdas%s', 123, '=', {})).to.equal('123work%%%=das{}');
    });

    it('on input two or more params', () => {
      expect(stringUtils.format('work %s', 123)).to.equal('work 123');
      expect(stringUtils.format('work', 123)).to.equal('work');
      expect(stringUtils.format('%swork%%%%sand%s', 123, '=', '%s')).to.equal('123work%%%=and%s');
    });
  });

  describe('#isInteger()', () => {
    it('on input int number', () => {
      expect(stringUtils.isInteger(123)).to.be.true;
    });

    it('on input empty', () => {
      expect(stringUtils.isInteger()).to.be.false;
      expect(stringUtils.isInteger('')).to.be.false;
    });

    it('on input not isInteger string', () => {
      expect(stringUtils.isInteger('223d')).to.be.false;
      expect(stringUtils.isInteger('32.23')).to.be.false;
      expect(stringUtils.isInteger('.32')).to.be.false;
      expect(stringUtils.isInteger('0.23')).to.be.false;
    });

    it('on input normal int number string', () => {
      expect(stringUtils.isInteger('123')).to.be.true;
    });
  });

  describe('#isNumber()', () => {
    it('on input int', () => {
      expect(stringUtils.isNumber(123)).to.be.true;
    });

    it('on input float', () => {
      expect(stringUtils.isNumber(0.23)).to.be.true;
    });

    it('on input empty', () => {
      expect(stringUtils.isNumber()).to.be.false;
      expect(stringUtils.isNumber('')).to.be.false;
      expect(stringUtils.isNumber({})).to.be.false;
    });

    it('on input not number string', () => {
      expect(stringUtils.isNumber('223d')).to.be.false;
      expect(stringUtils.isNumber('.32')).to.be.false;
    });

    it('on input normal int number string', () => {
      expect(stringUtils.isNumber('123')).to.be.true;
    });

    it('on input float string', () => {
      expect(stringUtils.isNumber('0.13')).to.be.true;
    });
  });

  describe('#isAscii()', () => {
    it('on input empty', () => {
      expect(stringUtils.isAscii('')).to.be.false;
      expect(stringUtils.isAscii()).to.be.false;
    });

    it('on input not sting and number', () => {
      expect(stringUtils.isAscii({})).to.be.false;
      expect(stringUtils.isAscii(() => {})).to.be.false;
    });

    it('on input not ascii string', () => {
      expect(stringUtils.isAscii('申请')).to.be.false;
    });

    it('on input normal ascii string', () => {
      expect(stringUtils.isAscii('~!@#$%^&*()_+')).to.be.true;
    });
  });

  describe('#.getExtension()', () => {
    it('should return empty when path is empty', () => {
      expect(stringUtils.getExtension('')).to.be.empty;
    });

    it('should throw TypeError when path is not string', () => {
      expect(() => {
        stringUtils.getExtension();
      }).to.throw(TypeError);
      expect(() => {
        stringUtils.getExtension({});
      }).to.throw(TypeError);
      expect(() => {
        stringUtils.getExtension(0);
      }).to.throw(TypeError);
      expect(() => {
        stringUtils.getExtension();
      }).to.throw(TypeError);
    });

    it('should return Extension when path is string', () => {
      expect(stringUtils.getExtension('sdd.')).to.be.empty;
      expect(stringUtils.getExtension('sdd.232.pn')).to.be.equal('pn');
      expect(stringUtils.getExtension('sdd.bmp')).to.be.equal('bmp');
    });
  });
  describe('#addClassName()', () => {
    const addClassName = stringUtils.addClassName;

    it('should has correct length', () => {
      expect(addClassName.length).to.be.equal(2);
    });

    it('should no space at start or end', () => {
      expect(addClassName('', 'ddd')).to.be.equal('ddd');
      expect(addClassName(' ', 'ddd')).to.be.equal('ddd');
      expect(addClassName(' ', 'ddd')).to.be.equal('ddd');
    });

    it('should add class correct', () => {
      expect(addClassName('class1 class2 ', 'ddd')).to.be.equal('class1 class2 ddd');
      expect(addClassName('class1 ', 'ddd')).to.be.equal('class1 ddd');
      expect(addClassName('class1 ', 'dd d')).to.be.equal('class1 dd d');
    });
  });

  describe('#removeClassName()', () => {
    const removeClassName = stringUtils.removeClassName;

    it('should has correct length', () => {
      expect(removeClassName.length).to.be.equal(2);
    });

    it('should no space at start or end', () => {
      expect(removeClassName('class1 classsd ', '')).to.be.equal('class1 classsd');
      expect(removeClassName(' class1 classsd', '')).to.be.equal('class1 classsd');
      expect(removeClassName(' class1 classsd', 'classsd')).to.be.equal('class1');
    });

    it('should remove class correct', () => {
      expect(removeClassName('class1 classsd', 'class1')).to.be.equal('classsd');
      expect(removeClassName('class1 ', 'class1')).to.be.equal('');
    });
  });
});
