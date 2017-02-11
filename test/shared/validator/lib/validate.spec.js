import validator from 'shared/validator/validates/single';

describe('validator.single', () => {
  describe('#len()', () => {
    const validateLen = validator.len;

    it('should return undefined when not min or max params', () => {
      expect(validateLen('sss')).toBeUndefined();
      expect(validateLen('')).toBeUndefined();
    });

    it('should return undefined when str length within the range', () => {
      expect(validateLen('sss', 1, 4)).toBeUndefined();
      expect(validateLen('sss', 1, 3)).toBeUndefined();
      expect(validateLen('sss', 3, 4)).toBeUndefined();
    });

    it('should return error msg when str length beyond range', () => {
      expect(validateLen('sss', 4, 4)).toBe('String length must be: 4 bit');
      expect(validateLen('s', 2, 8)).toBe('String length range is: 2 - 8 bit');
      expect(validateLen('sss', 1, 2)).toBe('String length range is: 1 - 2 bit');
    });
  });
  describe('#utf8Len()', () => {
    const validateLen = validator.utf8Len;

    it('should return undefined when not min and max params', () => {
      expect(validateLen('神经')).toBeUndefined();
    });

    it('should return undefined when str utf8 length within the range', () => {
      expect(validateLen('神奇', 1, 7)).toBeUndefined();
      expect(validateLen('sss', 1, 3)).toBeUndefined();
      expect(validateLen('sss', 3, 4)).toBeUndefined();
    });

    it('should return error msg when str utf8 length beyond range', () => {
      expect(validateLen('神经病', 4, 4)).toBe('String length must be: 4 bytes');
      expect(validateLen('神经病马撒大大', 2, 8)).toBe('String length range is: 2 - 8 bytes');
      expect(validateLen('神', 1, 2)).toBe('String length range is: 1 - 2 bytes');
    });
  });
});
