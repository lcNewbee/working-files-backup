var utils = require('shared/utils/index');

describe('utils', () => {
  it('version not empty', () => {
    expect(utils.version).not.toBe('');
  });
});
