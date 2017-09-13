// Link.react-test.js
import React from 'react';
import Button from 'shared/components/Button/Button';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Icon from 'shared/components/Icon';

describe('Shared component', () => {
  describe('Button', () => {
    it('should render without throwing an error', () => {
      const wrapper = shallow(<Button text="test" />);
      expect(wrapper.text()).toBe('test');
    });
    it('should render loading icon', () => {
      const wrapper = shallow(<Button loading />);
      expect(wrapper.find(Icon).length).toBe(1);
    });
    it('simulates click events', () => {
      const onButtonClick = sinon.spy();
      const wrapper = shallow(
        <Button onClick={onButtonClick} />,
      );
      wrapper.find('button').simulate('click');
      expect(onButtonClick.callCount).toBe(1);
    });
  });
});

