import { expect } from 'chai';
import { describe, it } from 'mocha';

import utils from 'shared/utils/index';

describe('utils', () => {
  it('version not empty', () => {
    expect(utils.version === '').to.be.equal(false);
  });
});
