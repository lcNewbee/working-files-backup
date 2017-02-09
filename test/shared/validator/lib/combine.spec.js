import validator from 'shared/validator/validates/combine';

describe('validator.combine', () => {
  describe('#noBroadcastIp()', () => {
    const validateFunc = validator.noBroadcastIp;

    it('should return error message when ip in mask is broadcast', () => {
      expect(validateFunc('192.168.0.255', '255.255.255.0')).toBe('Broadcast IP address is not allowed!');
    });

    it('should return undefined when ip in mask not Broadcast', () => {
      expect(validateFunc('192.168.0.22', '255.255.255.0')).toBeUndefined();
    });
  });
});
