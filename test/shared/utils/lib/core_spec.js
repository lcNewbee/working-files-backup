import { expect, assert } from 'chai';
import { describe, it } from 'mocha';

import core from 'shared/utils/lib/core';

describe('utils core', () => {
  describe('#extend()', () => {
    const objectAssign = core.extend;

    it('should have the correct length', () => {
      assert.equal(objectAssign.length, 2);
    });

    it('should throw when target is not an object', () => {
      assert.throws(() => {
        objectAssign(null);
      }, TypeError);
      assert.throws(() => {
        objectAssign(undefined);
      }, TypeError);
      assert.throws(() => {
        objectAssign();
      }, TypeError);
    });

    it('should extend self when only target arg', () => {
      expect(core.extend({ testKey: 1 })).to.include.keys('testKey');

      delete core.testKey;
      expect(core).to.not.include.keys('testKey');
    });

    it('should objectAssign own enumerable properties from source to target object', () => {
      assert.deepEqual(objectAssign({ foo: 0 }, { bar: 1 }), { foo: 0, bar: 1 });
      assert.deepEqual(objectAssign({ foo: 0 }, null, undefined), { foo: 0 });
      assert.deepEqual(objectAssign({ foo: 0 }, null, undefined,
        { bar: 1 }, null), { foo: 0, bar: 1 });
    });

    it('should not throw on null/undefined sources', () => {
      assert.doesNotThrow(() => {
        objectAssign({}, null);
      });

      assert.doesNotThrow(() => {
        objectAssign({}, undefined);
      });

      assert.doesNotThrow(() => {
        objectAssign({}, undefined, null);
      });
    });

    it('should support multiple sources', () => {
      assert.deepEqual(objectAssign({ foo: 0 }, { bar: 1 }, { bar: 2 }), { foo: 0, bar: 2 });
      assert.deepEqual(objectAssign({}, {}, { foo: 1 }), { foo: 1 });
    });

    it('should only iterate own keys', () => {
      const Unicorn = () => {};
      const unicorn = new Unicorn();

      Unicorn.prototype.rainbows = 'many';
      unicorn.bar = 1;

      assert.deepEqual(objectAssign({ foo: 1 }, unicorn), { foo: 1, bar: 1 });
    });

    it('should return the modified target object', () => {
      const target = {};
      const returned = objectAssign(target, { a: 1 });

      assert.equal(returned, target);
    });

    it('should support `Object.create(null)` objects', () => {
      const obj = Object.create(null);

      obj.foo = true;
      assert.deepEqual(objectAssign({}, obj), { foo: true });
    });

    // it('should preserve property order', () => {
    //   var letters = 'abcdefghijklmnopqrst';
    //   var source = {};
    //   letters.split('').forEach(function (letter) {
    //     source[letter] = letter;
    //   });
    //   var target = objectAssign({}, source);
    //   assert.equal(Object.keys(target).join(''), letters);
    // });
  });
});
