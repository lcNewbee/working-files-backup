import {
  expect,
  assert,
} from 'chai';
import {
  describe,
  it,
} from 'mocha';
import validator from 'shared/validator/lib/validate';

describe('validator.validate', () => {
  describe('#validate.len', () => {
    const validateFunc = validator.len;

    it('should return undefined when not min or max params', () => {
      expect(validateFunc('sss')).to.equal(undefined);
      expect(validateFunc('')).to.equal(undefined);
    });

    it('should return error msg when str length less than min', () => {
      expect(validateFunc('sss', 4, 4)).to.equal('String length must be: 4');
    });

    it('should return error msg when str length more than max', () => {
      expect(validateFunc('sss', 1, 2)).to.equal('String length range be: 1 - 2');
    });
  });
});
