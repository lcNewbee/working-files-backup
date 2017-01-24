import validator from 'shared/validator';

describe('utils validator', () => {
  const myValidator = validator();

  describe('core', () => {
    it('should have the correct Constructor', () => {
      expect(myValidator.constructor).toBe(validator);
    });
  });

  describe('prototype', () => {
    describe('#check()', () => {
      it('should have the correct length', () => {
        expect(myValidator.check.length).toBe(1);
      });

      it('should throw when str is not string', () => {
        expect(() => {
          myValidator.check(null);
        }).toThrowError('');
        expect(() => {
          myValidator.check(undefined);
        }).toThrowError('');
        expect(() => {
          myValidator.check({});
        }).toThrowError('');
      });

      it('should handle correct when option has one rule', () => {
        const oneRuleValidator = validator({
          rules: 'required',
        });

        expect(oneRuleValidator.check('12')).toBeUndefined(undefined);
        expect(oneRuleValidator.check('')).toBe('This field is required');
      });

      it('should handle exclude string', () => {
        const oneRuleOneArgValidator = validator({
          rules: 'ip',
          exclude: '0.0.0.0',
        });
        expect(oneRuleOneArgValidator.check('0.0.0.0'))
          .toBe(undefined);
      });

      it('should handle exclude string array', () => {
        const oneRuleOneArgValidator = validator({
          rules: 'ip',
          exclude: ['0.0.0.0', '255.255.255.255'],
        });
        expect(oneRuleOneArgValidator.check('0.0.0.0'))
          .toBe(undefined);
        expect(oneRuleOneArgValidator.check('255.255.255.255'))
          .toBe(undefined);
      });

      // rules = 'len:[1, 3]'
      it('should handle correct when option has one rule one param',
        () => {
          const oneRuleOneArgValidator = validator({
            rules: 'remarkTxt:"adc"',
          });
          expect(oneRuleOneArgValidator.check('addd'))
            .toBe("Can't input: a");
        },
      );

      it('should handle correct when option has one rule with params',
        () => {
          const oneRuleArgsValidator = validator({
            rules: 'len:[1, 3]',
          });

          expect(oneRuleArgsValidator.check(''))
            .toBe('String length range is: 1 - 3 bit');
        });

      it('should handle correct when option has rules with params',
        () => {
          const rulesWithArgsValidator = validator({
            rules: 'required|remarkTxt:"adc"|len:[1, 3]',
          });

          expect(rulesWithArgsValidator.check(''))
            .toBe('This field is required');

          expect(rulesWithArgsValidator.check('afggg'))
            .toBe("Can't input: a");

          expect(rulesWithArgsValidator.check('efggg'))
            .toBe('String length range is: 1 - 3 bit');
        });
    });

    describe('#checkClear()', () => {
      it('should have the correct length', () => {
        expect(myValidator.checkClear.length).toBe(1);
      });

      it('should throw when str is not string', () => {
        expect(() => {
          myValidator.checkClear(null);
        }).toThrowError('');
        expect(() => {
          myValidator.checkClear(undefined);
        }).toThrowError('');
        expect(() => {
          myValidator.checkClear({});
        }).toThrowError('');
      });

      it('should handle correct when option has rules with params',
        () => {
          const rulesWithArgsValidator = validator({
            rules: 'required|mac|ip',
          });

          expect(rulesWithArgsValidator.checkClear(''))
            .toBe(undefined);

          // expect(rulesWithArgsValidator.checkClear('00:00:00:00:00:00'))
          //   .toBe("Mac can not be 00:00:00:00:00:00");

          // expect(rulesWithArgsValidator.checkClear('127.'))
          //   .toBe("IP address first input don't be 127, becuse it is loopback address.");
          // expect(rulesWithArgsValidator.checkClear('245'))
          //   .toBe("First input 245 greater than 223.");
        });
    });
  });
});
