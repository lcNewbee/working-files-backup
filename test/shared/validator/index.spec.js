import {
  expect,
  assert,
} from 'chai';
import {
  describe,
  it,
} from 'mocha';
import validator from 'shared/validator';

describe('utils validator', () => {
  const myValidator = validator();

  describe('core', () => {
    it('should have the correct Constructor', () => {
      expect(myValidator.constructor).to.equal(validator);
    });
  });

  describe('prototype', () => {
    describe('#check()', () => {
      it('should have the correct length', () => {
        expect(myValidator.check.length).to.be.equal(1);
      });

      it('should throw when str is not string', () => {
        assert.throws(() => {
          myValidator.check(null);
        }, TypeError);
        assert.throws(() => {
          myValidator.check(undefined);
        }, TypeError);
        assert.throws(() => {
          myValidator.check({});
        }, TypeError);
      });

      it('should handle correct when option has one rule', () => {
        const oneRuleValidator = validator({
          rules: 'required',
        });

        expect(oneRuleValidator.check('12')).to.be.equal(undefined);
        expect(oneRuleValidator.check('')).to.be.equal('This field is required');
      });

      it('should handle exclude string', () => {
        const oneRuleOneArgValidator = validator({
          rules: 'ip',
          exclude: '0.0.0.0',
        });
        expect(oneRuleOneArgValidator.check('0.0.0.0'))
          .to.be.equal(undefined);
      });

      it('should handle exclude string array', () => {
        const oneRuleOneArgValidator = validator({
          rules: 'ip',
          exclude: ['0.0.0.0', '255.255.255.255'],
        });
        expect(oneRuleOneArgValidator.check('0.0.0.0'))
          .to.be.equal(undefined);
        expect(oneRuleOneArgValidator.check('255.255.255.255'))
          .to.be.equal(undefined);
      });

      // rules = 'len:[1, 3]'
      it('should handle correct when option has one rule one param',
        () => {
          const oneRuleOneArgValidator = validator({
            rules: 'remarkTxt:"adc"',
          });
          expect(oneRuleOneArgValidator.check('addd'))
            .to.be.equal("Can't input: a");
        },
      );

      it('should handle correct when option has one rule with params',
        () => {
          const oneRuleArgsValidator = validator({
            rules: 'len:[1, 3]',
          });

          expect(oneRuleArgsValidator.check(''))
            .to.be.equal('String length range is: 1 - 3');
        });

      it('should handle correct when option has rules with params',
        () => {
          const rulesWithArgsValidator = validator({
            rules: 'required|remarkTxt:"adc"|len:[1, 3]',
          });

          expect(rulesWithArgsValidator.check(''))
            .to.be.equal('This field is required');

          expect(rulesWithArgsValidator.check('afggg'))
            .to.be.equal("Can't input: a");

          expect(rulesWithArgsValidator.check('efggg'))
            .to.be.equal('String length range is: 1 - 3');
        });
    });

    describe('#checkClear()', () => {
      it('should have the correct length', () => {
        expect(myValidator.checkClear.length).to.be.equal(1);
      });

      it('should throw when str is not string', () => {
        assert.throws(() => {
          myValidator.checkClear(null);
        }, TypeError);
        assert.throws(() => {
          myValidator.checkClear(undefined);
        }, TypeError);
        assert.throws(() => {
          myValidator.checkClear({});
        }, TypeError);
      });

      it('should handle correct when option has rules with params',
        () => {
          const rulesWithArgsValidator = validator({
            rules: 'required|mac|ip',
          });

          expect(rulesWithArgsValidator.checkClear(''))
            .to.be.equal(undefined);

          // expect(rulesWithArgsValidator.checkClear('00:00:00:00:00:00'))
          //   .to.be.equal("Mac can not be 00:00:00:00:00:00");

          // expect(rulesWithArgsValidator.checkClear('127.'))
          //   .to.be.equal("IP address first input don't be 127, becuse it is loopback address.");
          // expect(rulesWithArgsValidator.checkClear('245'))
          //   .to.be.equal("First input 245 greater than 223.");
        });
    });
  });
});
