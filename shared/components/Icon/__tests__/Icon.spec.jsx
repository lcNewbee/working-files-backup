// Link.react-test.js
import React from 'react';
import Icon from 'shared/components/Icon';
import { shallow, mount, render } from 'enzyme';

describe('Link changes the class when hovered', () => {
  it('should render without throwing an error', () => {
    expect(shallow(<Icon name="edit" />).text()).toBe('');
  });
});
