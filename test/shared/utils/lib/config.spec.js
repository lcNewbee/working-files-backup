import config from 'shared/utils/lib/config';

// findPath
describe('utils config', () => {
  describe('#findPath()', () => {
    const objectAssign = config.findPath;

    it('should return empty array when id not found', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];
      expect(objectAssign(target, 'level')).toEqual([]);
    });

    it('should return array with only one element', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];

      expect(objectAssign(target, 'level0')).toEqual([0]);
    });

    it('should return path in deep depth in array of object', () => {
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

// getIn
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

    it('should return undefined if path is empty', () => {
      const target = [
        {
          id: 'level0',
          value: 'before',
        },
      ];
      expect(objectAssign(target, [])).toEqual(undefined);
    });

    it('should return undefined if no object was found by the path', () => {
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
      expect(objectAssign(target, [1, 'routes', 0, 'routes', 0])).toEqual(undefined);
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

// setIn
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

    it('should return target without change if path is empty', () => {
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

    it('should return target without change if object can not be found by the path', () => {
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

    it('should return the target array with the object refered by the path changed', () => {
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

// merge
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

    it('should return the target array with the object refered by the path changed', () => {
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

// mergeIn
describe('utils config', () => {
  describe('#mergeIn()', () => {
    const objectAssign = config.mergeIn;
    // it('should throw error if item to be merged in is not an object')

    // it('should throw error if item refered by path is not an object')

    it('should return object with shadow object merged in', () => {
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

    it('should return the target array with the object refered by the path changed', () => {
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

// deleteIn
describe('utils config', () => {
  describe('#deleteIn()', () => {
    const objectAssign = config.deleteIn;

    // should throw error if path is not an array

    it('should return the target array with the OBJECT refered by the path deleted', () => {
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

      expect(objectAssign(target, [1, 'routes', 1, 'routes', 0])).toEqual(
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
                routes: [],
              },
            ],
          },
        ]);
    });

    it('should return the target array with the ATTRIBUATE refered by the path deleted', () => {
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

      expect(objectAssign(target, [1, 'routes', 1, 'routes', 0, 'value'])).toEqual(
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
                    origin: 'still',
                  },
                ],
              },
            ],
          },
        ]);
    });

    it('should return the target without change if object refered by the path is not found', () => {
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

      expect(objectAssign(target, [1, 'routes', 1, 'routes', 1])).toEqual(target);
    });
  });
});

// delete
describe('utils config', () => {
  describe('#delete()', () => {
    const objectAssign = config.delete;

    // should throw error if id list is not an array

    it('should return the target array with the object refered by id list deleted', () => {
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

      expect(objectAssign(target, ['level0', 'level2'])).toEqual(
        [
          {
            routes: [
              {
                id: 'level1',
                value: 'level1',
              },
              {
                routes: [],
              },
            ],
          },
        ]);
    });

    it('should return the target without change if object refered by the id list is not found', () => {
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

      expect(objectAssign(target, ['a', 'b'])).toEqual(target);
    });
  });
});

// append
describe('utils config', () => {
  describe('#append()', () => {
    const objectAssign = config.append;

    // should throw error if item refered by path is not an array

    it('should return the target with the object given append to the array refered by path', () => {
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

      const value = {
        id: 'level3',
        value: 'level3',
      };

      expect(objectAssign(target, [1, 'routes', 1, 'routes'], value)).toEqual(
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
                    value: 'level2',
                    origin: 'still',
                  },
                  {
                    id: 'level3',
                    value: 'level3',
                  },
                ],
              },
            ],
          },
        ]);
    });

    it('should return the target without change if object refered by path is not found', () => {
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

      expect(objectAssign(target, ['a', 'b'], { id: 'level' })).toEqual(target);
    });
  });
});

// addBefore
describe('utils config', () => {
  describe('#addBefore()', () => {
    const objectAssign = config.addBefore;

    // should throw error if item to be add is not an object

    it('should return the target with the object insert before the object refered by id', () => {
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

      const value = {
        id: 'level3',
        value: 'level3',
      };

      expect(objectAssign(target, 'level2', value)).toEqual(
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
                    id: 'level3',
                    value: 'level3',
                  },
                  {
                    id: 'level2',
                    value: 'level2',
                    origin: 'still',
                  },
                ],
              },
            ],
          },
        ]);
    });

    it('should return the target without change if object refered by path is not found', () => {
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

      expect(objectAssign(target, 'a', { id: 'level' })).toEqual(target);
    });
  });
});
