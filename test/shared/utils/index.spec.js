import utils from 'shared/utils/index';

describe('utils', () => {
  it('version not empty', () => {
    expect(utils.version).not.toBe('');
  });
});
