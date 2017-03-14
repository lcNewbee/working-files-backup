import gpsUtils from 'shared/utils/lib/gps';

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
      expect(getGpsPointFromOffset(
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
      )).toEqual({
        lat: 22.502423986242,
        lng: 113.93842783228,
      });
    });
  });
});
