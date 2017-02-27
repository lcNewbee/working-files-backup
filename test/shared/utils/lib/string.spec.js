/* eslint-disable no-unused-expressions */
import stringUtils from 'shared/utils/lib/string';

describe('utils string', () => {
  describe('#prefixInteger()', () => {
    it('on input not string or number, return empty', () => {
      expect(stringUtils.prefixInteger({ as: 123 })).toBe('');
      expect(stringUtils.prefixInteger(() => {})).toBe('');
      expect(stringUtils.prefixInteger(new RegExp())).toBe('');
      expect(stringUtils.prefixInteger()).toBe('');
    });

    it('on input not param length ro length < number length', () => {
      expect(stringUtils.prefixInteger(12)).toBe('12');
      expect(stringUtils.prefixInteger(12, 1)).toBe('12');
    });

    it('on input normal params', () => {
      expect(stringUtils.prefixInteger(12, 5)).toBe('00012');
      expect(stringUtils.prefixInteger(12, 4)).toBe('0012');
    });
  });

  describe('#toCamel()', () => {
    it('on input not string or empty, return empty', () => {
      expect(stringUtils.toCamel({ as: 123 })).toBe('');
      expect(stringUtils.toCamel(() => {})).toBe('');
      expect(stringUtils.toCamel(new RegExp())).toBe('');
      expect(stringUtils.toCamel()).toBe('');
      expect(stringUtils.toCamel('')).toBe('');
    });

    it('on input normal word', () => {
      expect(stringUtils.toCamel('work')).toBe('Work');
      expect(stringUtils.toCamel('_work')).toBe('_work');
    });
  });

  describe('#format()', () => {
    it('on input first param not string or empty', () => {
      expect(stringUtils.format({ as: 123 })).toBe('');
      expect(stringUtils.format(() => {})).toBe('');
      expect(stringUtils.format(new RegExp())).toBe('');
      expect(stringUtils.format()).toBe('');
      expect(stringUtils.format('')).toBe('');
    });

    it('on input after first param is object', () => {
      expect(stringUtils.format('%swork%%%%sdas%s', 123, '=', new Date('2016-04-08T03:17:01.169Z')))
        .toBe('123work%%%=das"2016-04-08T03:17:01.169Z"');
      expect(stringUtils.format('%swork%%%%sdas%s', 123, '=', {})).toBe('123work%%%=das{}');
    });

    it('on input two or more params', () => {
      expect(stringUtils.format('work %s', 123)).toBe('work 123');
      expect(stringUtils.format('work', 123)).toBe('work');
      expect(stringUtils.format('%swork%%%%sand%s', 123, '=', '%s')).toBe('123work%%%=and%s');
    });
  });

  describe('#isInteger()', () => {
    it('on input int number', () => {
      expect(stringUtils.isInteger(123)).toBe(true);
    });

    it('on input empty', () => {
      expect(stringUtils.isInteger()).toBe(false);
      expect(stringUtils.isInteger('')).toBe(false);
    });

    it('on input not isInteger string', () => {
      expect(stringUtils.isInteger('223d')).toBe(false);
      expect(stringUtils.isInteger('32.23')).toBe(false);
      expect(stringUtils.isInteger('.32')).toBe(false);
      expect(stringUtils.isInteger('0.23')).toBe(false);
    });

    it('on input normal int number string', () => {
      expect(stringUtils.isInteger('123')).toBe(true);
    });
  });

  describe('#isNumber()', () => {
    it('on input int', () => {
      expect(stringUtils.isNumber(123)).toBe(true);
    });

    it('on input float', () => {
      expect(stringUtils.isNumber(0.23)).toBe(true);
    });

    it('on input empty', () => {
      expect(stringUtils.isNumber()).toBe(false);
      expect(stringUtils.isNumber('')).toBe(false);
      expect(stringUtils.isNumber({})).toBe(false);
    });

    it('on input not number string', () => {
      expect(stringUtils.isNumber('223d')).toBe(false);
      expect(stringUtils.isNumber('.32')).toBe(false);
    });

    it('on input normal int number string', () => {
      expect(stringUtils.isNumber('123')).toBe(true);
    });

    it('on input float string', () => {
      expect(stringUtils.isNumber('0.13')).toBe(true);
    });
  });

  describe('#isAscii()', () => {
    it('on input empty', () => {
      expect(stringUtils.isAscii('')).toBe(false);
      expect(stringUtils.isAscii()).toBe(false);
    });

    it('on input not sting and number', () => {
      expect(stringUtils.isAscii({})).toBe(false);
      expect(stringUtils.isAscii(() => {})).toBe(false);
    });

    it('on input not ascii string', () => {
      expect(stringUtils.isAscii('申请')).toBe(false);
    });

    it('on input normal ascii string', () => {
      expect(stringUtils.isAscii('~!@#$%^&*()_+')).toBe(true);
    });
  });

  describe('#.getExtension()', () => {
    it('should return empty when path is empty', () => {
      expect(stringUtils.getExtension('')).toBe('');
    });

    it('should throw TypeError when path is not string', () => {
      expect(() => {
        stringUtils.getExtension();
      }).toThrowError(TypeError);
      expect(() => {
        stringUtils.getExtension({});
      }).toThrowError(TypeError);
      expect(() => {
        stringUtils.getExtension(0);
      }).toThrowError(TypeError);
      expect(() => {
        stringUtils.getExtension();
      }).toThrowError(TypeError);
    });

    it('should return Extension when path is string', () => {
      expect(stringUtils.getExtension('sdd.')).toBe('');
      expect(stringUtils.getExtension('sdd.232.pn')).toBe('pn');
      expect(stringUtils.getExtension('sdd.bmp')).toBe('bmp');
    });
  });
  describe('#addClassName()', () => {
    const addClassName = stringUtils.addClassName;

    it('should has correct length', () => {
      expect(addClassName.length).toBe(2);
    });

    it('should no space at start or end', () => {
      expect(addClassName('', 'ddd')).toBe('ddd');
      expect(addClassName(' ', 'ddd')).toBe('ddd');
      expect(addClassName(' ', 'ddd')).toBe('ddd');
    });

    it('should add class correct', () => {
      expect(addClassName('class1 class2 ', 'ddd')).toBe('class1 class2 ddd');
      expect(addClassName('class1 ', 'ddd')).toBe('class1 ddd');
      expect(addClassName('class1 ', 'dd d')).toBe('class1 dd d');
    });
  });

  describe('#removeClassName()', () => {
    const removeClassName = stringUtils.removeClassName;

    it('should has correct length', () => {
      expect(removeClassName.length).toBe(2);
    });

    it('should no space at start or end', () => {
      expect(removeClassName('class1 classsd ', '')).toBe('class1 classsd');
      expect(removeClassName(' class1 classsd', '')).toBe('class1 classsd');
      expect(removeClassName(' class1 classsd', 'classsd')).toBe('class1');
    });

    it('should remove class correct', () => {
      expect(removeClassName('class1 classsd', 'class1')).toBe('classsd');
      expect(removeClassName('class1 ', 'class1')).toBe('');
    });
  });

  describe('#changeMaskNumberToIp', () => {
    const changeMaskNumberToIp = stringUtils.changeMaskNumberToIp;

    it('should has correct length', () => {
      expect(changeMaskNumberToIp.length).toBe(1);
    });

    it('should return undefined then param is not num or number string', () => {
      expect(changeMaskNumberToIp()).toBe(undefined);
      expect(changeMaskNumberToIp({})).toBe(undefined);
    });

    it('should change correct when number is integral multiple 8', () => {
      expect(changeMaskNumberToIp(32)).toBe('255.255.255.255');
      expect(changeMaskNumberToIp(24)).toBe('255.255.255.0');
    });
    it('should change correct when number is not multiple 8', () => {
      expect(changeMaskNumberToIp(30)).toBe('255.255.255.252');
    });
  });
});
