import {expect, assert} from 'chai';

import utils from '../index';

describe('utils', () => {
  it('version not empty', () => {
    expect(utils.version).to.not.empty;
  })
});