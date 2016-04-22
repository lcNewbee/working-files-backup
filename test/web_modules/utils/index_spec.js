import {expect, assert} from 'chai';

import utils from '../../../web_modules/utils/index';

describe('utils', () => {
  it('version not empty', () => {
    expect(utils.version).to.not.empty;
  })
});