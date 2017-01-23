import { expect } from 'chai';
import { describe, it } from 'mocha';
import validator from 'shared/validator/validates/single';

describe('validator.validate', () => {
  describe('#len()', () => {
    const validateFunc = validator.len;

    it('should return undefined when not min or max params', () => {
      expect(validateFunc('sss')).to.equal(undefined);
      expect(validateFunc('')).to.equal(undefined);
    });

    it('should return error msg when str length within the range', () => {
      expect(validateFunc('sss', 1, 4)).to.equal(undefined);
      expect(validateFunc('sss', 1, 3)).to.equal(undefined);
      expect(validateFunc('sss', 3, 4)).to.equal(undefined);
    });

    it('should return error msg when str length beyond range', () => {
      expect(validateFunc('sss', 4, 4)).to.equal('String length must be: 4');
      expect(validateFunc('s', 2, 8)).to.equal('String length range is: 2 - 8');
      expect(validateFunc('sss', 1, 2)).to.equal('String length range is: 1 - 2');
    });
  });
});
