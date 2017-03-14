import gpsUtils from 'shared/utils/lib/gps';
import stringUtils from 'shared/utils/lib/string';

describe('utils', () => {
  describe('#getOffsetFromGpsPoint()', () => {
    const getOffsetFromGpsPoint = gpsUtils.getOffsetFromGpsPoint;

    it('should handle correct', () => {
      expect(
        getOffsetFromGpsPoint({
          lat: 22.502423986242,
          lng: 113.93842783228,
        }, {
          lat: 22.502313986242,
          lng: 113.93832783228,
          width: 30,
          length: 20,
        }),
      ).toEqual({
        x: 50,
        y: 40.3333,
      });
    });
  });

  describe('#getGpsPointFromOffset', () => {
    const getGpsPointFromOffset = gpsUtils.getGpsPointFromOffset;

    it('should have the correct length', () => {
      const retGps = getGpsPointFromOffset(
        {
          x: 50,
          y: 40.3333,
        },
        {
          lat: 22.502313986242,
          lng: 113.93832783228,
          width: 30,
          length: 20,
        },
      );

      // 精度只要小数点8位即可 厘米
      retGps.lat = stringUtils.cutFixedFloat(retGps.lat, 8);
      retGps.lng = stringUtils.cutFixedFloat(retGps.lng, 8);

      expect(retGps).toEqual({
        lat: 22.50242398,
        lng: 113.93842783,
      });
    });
  });
});
