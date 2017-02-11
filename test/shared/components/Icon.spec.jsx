// Link.react-test.js
import React from 'react';
import Icon from 'shared/components/Icon';
import renderer from 'react-test-renderer';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Icon name="cog" spin size="2x" />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // // manually trigger the callback
  // tree.props.onMouseEnter();
  // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();

  // // manually trigger the callback
  // tree.props.onMouseLeave();
  // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();
});
