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

  // 254|252|248|240|224|192|128
  describe('#noHostBitsAllZero', () => {
    const noHostBitsAllZero = combine.noHostBitsAllZero;

    it('When params ip or mask not type string return err msg', () => {
      expect(noHostBitsAllZero('', {})).toBe('Subnet Mask must be string');
      expect(noHostBitsAllZero({}, '')).toBe('IP address must be string');
    });

    it('When ip host bits not all zero should return undefinded', () => {
      expect(noHostBitsAllZero('192.168.3.1', '255.255.255.0')).toBeUndefined();
      expect(noHostBitsAllZero('192.168.192.0', '255.255.128.0')).toBeUndefined();
      expect(noHostBitsAllZero('192.254.0.0', '255.252.0.0')).toBeUndefined();
      expect(noHostBitsAllZero('252.0.0.0', '240.0.0.0')).toBeUndefined();
    });

    it('should return msg', () => {
      expect(noHostBitsAllZero('192.168.1.128', '255.255.255.192')).toBe('IP address host bits Can not all zero');
      expect(noHostBitsAllZero('192.168.128.0', '255.255.192.0')).toBe('IP address host bits Can not all zero');
      expect(noHostBitsAllZero('192.252.0.0', '255.254.0.0')).toBe('IP address host bits Can not all zero');
      expect(noHostBitsAllZero('128.0.0.0', '192.0.0.0')).toBe('IP address host bits Can not all zero');
    });
  });
});
