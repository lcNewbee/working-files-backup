import core from 'shared/utils/lib/core';

describe('utils core', () => {
  describe('#extend()', () => {
    const objectAssign = core.extend;

    it('should have the correct length', () => {
      expect(objectAssign.length).toBe(1);
    });

    it('should throw when target is not an object', () => {
      expect(() => {
        objectAssign(null);
      }).toThrowError('');
      expect(() => {
        objectAssign(undefined);
      }).toThrowError('');
      expect(() => {
        objectAssign();
      }).toThrowError('');
    });

    it('should extend self when only target arg', () => {
      core.extend({ testKey: 1 });
      expect(core.testKey).toBe(1);

      delete core.testKey;
      expect(core.testKey).toBeUndefined();
    });

    it('should objectAssign own enumerable properties from source to target object', () => {
      expect(objectAssign({ foo: 0 }, { bar: 1 })).toEqual({ foo: 0, bar: 1 });
      expect(objectAssign({ foo: 0 }, null, undefined)).toEqual({ foo: 0 });
      expect(
        objectAssign({ foo: 0 },
        null,
        undefined,
        { bar: 1 }, null),
      ).toEqual({ foo: 0, bar: 1 });
    });

    it('should support multiple sources', () => {
      expect(objectAssign({ foo: 0 }, { bar: 1 }, { bar: 2 })).toEqual({ foo: 0, bar: 2 });
      expect(objectAssign({}, {}, { foo: 1 })).toEqual({ foo: 1 });
    });

    it('should only iterate own keys', () => {
      const Unicorn = () => {};
      const unicorn = new Unicorn();

      Unicorn.prototype.rainbows = 'many';
      unicorn.bar = 1;

      expect(objectAssign({ foo: 1 }, unicorn)).toEqual({ foo: 1, bar: 1 });
    });

    it('should return the modified target object', () => {
      const target = {};
      const returned = objectAssign(target, { a: 1 });

      expect(returned).toEqual(target);
    });

    it('should support `Object.create(null)` objects', () => {
      const obj = Object.create(null);

      obj.foo = true;
      expect(objectAssign({}, obj))
        .toEqual({ foo: true });
    });


    // it('should preserve property order', () => {
    //   var letters = 'abcdefghijklmnopqrst';
    //   var source = {};
    //   letters.split('').forEach(function (letter) {
    //     source[letter] = letter;
    //   });
    //   var target = objectAssign({}, source);
    //   expect(Object.keys(target).join(''), letters);
    // });
  });

  describe('#isArray()', () => {
    it('should return true when call with array', () => {
      expect(core.isArray([])).toBe(true);
    });
    it('should return false when call with string, number, null, undefined', () => {
      expect(core.isArray(null)).toBe(false);
      expect(core.isArray(122)).toBe(false);
      expect(core.isArray('232')).toBe(false);
    });
  });

  describe('#getIn()', () => {
    it('should return undefined when not target and path', () => {
      expect(core.getIn()).toBe(undefined);
    });
    it('should return undefined when not target', () => {
      expect(core.getIn(undefined, '')).toBe(undefined);
      expect(core.getIn(undefined, [1, 2] )).toBe(undefined);
    });
    it('should return undefined when path is not array', () => {
      expect(core.getIn({a: '222'}, '')).toBe(undefined);
      expect(core.getIn({a: '222'})).toBe(undefined);
    });
    it('should return correct when has target and path is array', () => {
      expect(core.getIn({a: '222'}, ['a'])).toBe('222');
      expect(core.getIn('123123', [2])).toBe('3');
      expect(core.getIn({
        a: '222',
        bar: {
          far: [
            {
              bar: 1
            }
          ]
        }
      }, ['bar', 'far', 0, 'bar'])).toBe(1);
    });
  });


  describe('#binds()', () => {
    let sandbox;

    beforeEach(() => {
      // create a sandbox
      sandbox = sinon.sandbox.create();

      // stub some console methods
      sandbox.stub(console, 'log');
      sandbox.stub(console, 'error');
    });

    afterEach(() => {
      // restore the environment as it was before
      sandbox.restore();
    });

    it('should have the correct length', () => {
      expect(core.binds.length).toBe(2);
    });

    it('should bind when param target and keys array', (done) => {
      const targetObj = {
        a: '22',
        click() {
          expect(this).toBe(targetObj);
          done();
        },
      };
      // targetObj.click = targetObj.click.bind(targetObj);
      core.binds(targetObj, ['click']);
      setTimeout(targetObj.click, 1);
    });

    it('should call console.error when no param', () => {
      const errorMsg = 'utils.binds should call with object target and array keys';
      core.binds();
      sinon.assert.calledOnce(console.error);
      sinon.assert.calledWithExactly(console.error, `Warning: ${errorMsg}`);
    });
    it('should console.error when param keys is not array', () => {
      const errorMsg = 'utils.binds should call with object target and array keys';

      core.binds({});
      core.binds({}, null);
      core.binds({}, 1222);
      core.binds({}, 'ds');
      sinon.assert.callCount(console.error, 4);
      sinon.assert.calledWithExactly(console.error, `Warning: ${errorMsg}`);
    });
  });

  describe('#getUtf8Length', () => {
    it('should throw error when target is not an object', () => {
      expect(() => {
        core.getUtf8Length(null);
      }).toThrowError('');
      expect(() => {
        core.getUtf8Length(undefined);
      }).toThrowError('');
      expect(() => {
        core.getUtf8Length({});
      }).toThrowError('');
    });
    it('should return bytes length when isAscii string', () => {
      expect(core.getUtf8Length('ab12~*')).toBe(6);
      expect(core.getUtf8Length('')).toBe(0);
    });
    it('should  return bytes length when content 2 bytes string', () => {
      expect(core.getUtf8Length('s中s')).toBe(5);
    });
    it('should return bytes length when content 3 bytes string', () => {
      expect(core.getUtf8Length('吉祥如意ss')).toBe(14);
    });
    it('should return bytes length when content 4 bytes string', () => {
      expect(core.getUtf8Length('及𠮷格ss')).toBe(12);
    });
  });
});
