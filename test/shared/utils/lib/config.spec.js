import config from 'shared/utils/lib/config';
/*
describe('utils config', () => {
  describe('#merge()', () => {
    const objectAssign = config.merge;

    it('should throw when target is not Array', () => {
      expect(() => {
        objectAssign(null);
      }).toThrowError('');
      expect(() => {
        objectAssign(undefined);
      }).toThrowError('');
      expect(() => {
        objectAssign();
      }).toThrowError('');
      expect(() => {
        objectAssign('abcd');
      }).toThrowError('');
      expect(() => {
        objectAssign(2);
      }).toThrowError('');
      expect(() => {
        objectAssign({ id: '1' });
      }).toThrowError('');
    });

    it('should merge array item to target with the same id (shadow merge)', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];

      expect(objectAssign(target, [
        {
          id: 'level0',
          value: 'after',
          addValue: 'added',
        },
      ])).toEqual([
        {
          id: 'level0',
          value: 'after',
          addValue: 'added',
        },
      ]);
    });

    it('should not merge array item to target if id not found', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];
      expect(objectAssign(target, [
        {
          id: 'level',
          value: 'before',
        },
      ])).toEqual(target);
    });

    it('should merge array item to target with the same id (deep merge)', () => {
      const target = [
        {
          id: 'level0',
          value: 'level0',
        },
        {
          routes: [
            {
              id: 'level1',
              value: 'level1',
            },
            {
              routes: [
                {
                  id: 'level2',
                  value: 'level2',
                },
              ],
            },
          ],
        },
      ];
      expect(objectAssign(target, [
        {
          id: 'level0',
          value: 'after0',
          addValue: 'added0',
        },
        {
          id: 'level1',
          value: 'after1',
          addValue: 'added1',
        },
        {
          id: 'level2',
          value: 'after2',
          addValue: 'added2',
        },
      ])).toEqual([
        {
          id: 'level0',
          value: 'after0',
          addValue: 'added0',
        },
        {
          routes: [
            {
              id: 'level1',
              value: 'after1',
              addValue: 'added1',
            },
            {
              routes: [
                {
                  id: 'level2',
                  value: 'after2',
                  addValue: 'added2',
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});
*/

describe('utils config', () => {
  describe('#findRoute()', () => {
    const objectAssign = config.findRoute;

    it('should return array with only one element', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];

      expect(objectAssign(target, 'level0')).toEqual([0]);
    });

    it('should return empty array when id not found', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];
      expect(objectAssign(target, 'level')).toEqual([]);
    });

    it('should return route in depth in array type', () => {
      const target = [
        {
          id: 'level0',
          value: 'level0',
        },
        {
          routes: [
            {
              id: 'level1',
              value: 'level1',
            },
            {
              routes: [
                {
                  id: 'level2',
                  value: 'level2',
                },
              ],
            },
          ],
        },
      ];
      expect(objectAssign(target, 'level2')).toEqual([1, 'routes', 1, 'routes', 0]);
    });
  });
});

describe('utils config', () => {
  describe('#getIn()', () => {
    const objectAssign = config.getIn;

    it('should return object in shadow depth', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];

      expect(objectAssign(target, [0])).toEqual(
        {
          id: 'level0',
          value: 'before',
        });
    });

    it('should return null if no object was found by the route', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];
      expect(objectAssign(target, [])).toEqual(null);
    });

    it('should return object in deep depth', () => {
      const target = [
        {
          id: 'level0',
          value: 'level0',
        },
        {
          routes: [
            {
              id: 'level1',
              value: 'level1',
            },
            {
              routes: [
                {
                  id: 'level2',
                  value: 'level2',
                },
              ],
            },
          ],
        },
      ];
      expect(objectAssign(target, [1, 'routes', 1, 'routes', 0])).toEqual(
        {
          id: 'level2',
          value: 'level2',
        });
    });
  });
});

describe('utils config', () => {
  describe('#setIn()', () => {
    const objectAssign = config.setIn;

    it('should return object with shadow object changed', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];

      const value = {
        id: 'level0',
        value: 'after',
        added: 'addValue',
      };

      expect(objectAssign(target, [0], value)).toEqual(
        [{
          id: 'level0',
          value: 'after',
          added: 'addValue',
        }]);
    });

    it('should throw error if route is empty', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];
      const value = {
        id: 'level0',
        value: 'after',
        added: 'addValue',
      };
      expect(objectAssign(target, [], value)).toEqual(target);
    });

    it('should throw error if object can not find', () => {
      const target = [
        {
          id: 'level0',
          value: 'level0',
        },
        {
          routes: [
            {
              id: 'level1',
              value: 'level1',
            },
            {
              routes: [
                {
                  id: 'level2',
                  value: 'level2',
                },
              ],
            },
          ],
        },
      ];

      const value = {
        id: 'level0',
        value: 'after',
        added: 'addValue',
      };
      expect(objectAssign(target, [1, 'routes', undefined, 'routes', 0], value)).toEqual(target);
    });

    it('should return the target array with the object refered by the route changed', () => {
      const target = [
        {
          id: 'level0',
          value: 'level0',
        },
        {
          routes: [
            {
              id: 'level1',
              value: 'level1',
            },
            {
              routes: [
                {
                  id: 'level2',
                  value: 'level2',
                },
              ],
            },
          ],
        },
      ];

      const value = {
        id: 'level2',
        value: 'after',
        added: 'addValue',
      };
      expect(objectAssign(target, [1, 'routes', 1, 'routes', 0], value)).toEqual(
        [
          {
            id: 'level0',
            value: 'level0',
          },
          {
            routes: [
              {
                id: 'level1',
                value: 'level1',
              },
              {
                routes: [
                  {
                    id: 'level2',
                    value: 'after',
                    added: 'addValue',
                  },
                ],
              },
            ],
          },
        ]);
    });
  });
});


describe('utils config', () => {
  describe('#merge()', () => {
    const objectAssign = config.merge;

    it('should return object with shadow object changed', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];

      const value = [{
        id: 'level0',
        value: 'after',
        added: 'addValue',
      }];

      expect(objectAssign(target, value)).toEqual(
        [{
          id: 'level0',
          value: 'after',
          added: 'addValue',
        }]);
    });

    it('should return the target array with the object refered by the route changed', () => {
      const target = [
        {
          id: 'level0',
          value: 'level0',
        },
        {
          routes: [
            {
              id: 'level1',
              value: 'level1',
            },
            {
              routes: [
                {
                  id: 'level2',
                  value: 'level2',
                  origin: 'still',
                },
              ],
            },
          ],
        },
      ];

      const value = [
        {
          id: 'level2',
          value: 'after',
          added: 'addValue',
        },
        {
          id: 'level1',
          value: 'after',
          added: 'addValue1',
        },
        {
          id: 'level0',
          value: 'after',
          added: 'addValue0',
        },
        {
          id: 'level4',
          value: 'level4',
        },
      ];
      expect(objectAssign(target, value)).toEqual(
        [
          {
            id: 'level0',
            value: 'after',
            added: 'addValue0',
          },
          {
            routes: [
              {
                id: 'level1',
                value: 'after',
                added: 'addValue1',
              },
              {
                routes: [
                  {
                    id: 'level2',
                    value: 'after',
                    added: 'addValue',
                    origin: 'still',
                  },
                ],
              },
            ],
          },
        ]);
    });
  });
});
