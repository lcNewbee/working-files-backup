import chai, { expect, assert} from 'chai';
import validator from '../../lib/validator';

const should = chai.should();

describe('utils validator', () => {
  let myValidator = validator();

  describe('core', () => {
    it('should have the correct Constructor', function () {
      expect(myValidator.constructor).to.equal(validator);
    });
  });

  describe('prototype', () => {
    describe('#check()', () => {
      it('should have the correct length', function() {
        expect(myValidator.check.length).to.be.equal(1);
      });

      it('should throw when str is not string', function () {
        assert.throws(function () {
          myValidator.check(null);
        }, TypeError);
        assert.throws(function () {
          myValidator.check(undefined);
        }, TypeError);
        assert.throws(function () {
          myValidator.check({});
        }, TypeError);
      });

      it('should handle correct when option has one rule', function () {
        var oneRuleValidator = validator({
          rules: 'required',
        });

        expect(oneRuleValidator.check('12')).to.be.equal(undefined);
        expect(oneRuleValidator.check('')).to.be.equal('This field is required');
      });

      // rules = 'len:[1, 3]'
      it('should handle correct when option has one rule one param',
          function () {
        let oneRuleOneArgValidator = validator({
          rules: 'remarkTxt:"adc"',
        });
        expect(oneRuleOneArgValidator.check('addd'))
          .to.be.equal("Can't input: a");
      });

      it('should handle correct when option has one rule with params',
          function () {
        let oneRuleArgsValidator = validator({
          rules: 'len:[1, 3]',
        });

        expect(oneRuleArgsValidator.check(''))
          .to.be.equal("String length range is: 1 - 3 bit");
      });

      it('should handle correct when option has rules with params',
          function () {
        let rulesWithArgsValidator = validator({
          rules: 'required|remarkTxt:"adc"|len:[1, 3]',
        });

        expect(rulesWithArgsValidator.check(''))
          .to.be.equal("This field is required");

        expect(rulesWithArgsValidator.check('afggg'))
          .to.be.equal("Can't input: a");

        expect(rulesWithArgsValidator.check('efggg'))
          .to.be.equal("String length range is: 1 - 3 bit");
      });
    });

    describe('#checkClear()', () => {
      it('should have the correct length', function() {
        expect(myValidator.checkClear.length).to.be.equal(1);
      });

      it('should throw when str is not string', function () {
        assert.throws(function () {
          myValidator.checkClear(null);
        }, TypeError);
        assert.throws(function () {
          myValidator.checkClear(undefined);
        }, TypeError);
        assert.throws(function () {
          myValidator.checkClear({});
        }, TypeError);
      });

      it('should handle correct when option has rules with params',
          function () {
        let rulesWithArgsValidator = validator({
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
