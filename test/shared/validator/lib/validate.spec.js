import validator from 'shared/validator/validates/single';

describe('validator.validate', () => {
  describe('#len()', () => {
    const validateFunc = validator.len;

    it('should return undefined when not min or max params', () => {
      expect(validateFunc('sss')).toBeUndefined();
      expect(validateFunc('')).toBeUndefined();
    });

    it('should return error msg when str length within the range', () => {
      expect(validateFunc('sss', 1, 4)).toBeUndefined();
      expect(validateFunc('sss', 1, 3)).toBeUndefined();
      expect(validateFunc('sss', 3, 4)).toBeUndefined();
    });

    it('should return error msg when str length beyond range', () => {
      expect(validateFunc('sss', 4, 4)).toBe('String length must be: 4 bit');
      expect(validateFunc('s', 2, 8)).toBe('String length range is: 2 - 8 bit');
      expect(validateFunc('sss', 1, 2)).toBe('String length range is: 1 - 2 bit');
    });
  });
});
