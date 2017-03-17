import combine from 'shared/validator/validates/combine';

describe('validator.combine', () => {
  describe('#noBroadcastIp', () => {
    const validateFunc = combine.noBroadcastIp;

    it('should return error message when ip in mask is broadcast', () => {
      expect(validateFunc('192.168.0.255', '255.255.255.0')).toBe('Broadcast IP address is not allowed!');
    });

    it('should return undefined when ip in mask not Broadcast', () => {
      expect(validateFunc('192.168.0.22', '255.255.255.0')).toBeUndefined();
    });
  });

  describe('#needSeparateSegment', () => {
    const needSeparateSegment = combine.needSeparateSegment;

    it('should return no msg', () => {
      expect(needSeparateSegment('192.168.3.1', '255.255.255.0', '192.168.4.1', '255.255.255.0')).toBeUndefined();
    });
    it('should return msg', () => {
      expect(needSeparateSegment('192.168.2.1', '255.255.240.0', '192.168.3.1', '255.255.255.0')).toBe('Can not has same segment');
    });
  });
});
