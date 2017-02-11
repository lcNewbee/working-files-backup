// Link.react-test.js
import React from 'react';
import Button from 'shared/components/Button/Button';
import SaveButton from 'shared/components/Button/SaveButton';
import renderer from 'react-test-renderer';

describe('Shared component', () => {
  it('Button', () => {
    const component = renderer.create(
      <Button text="cog" />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    tree.props.onClick();
    tree = component.toJSON();
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

  it('SaveButton', () => {
    let component = renderer.create(
      <SaveButton text="cog" />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component = renderer.create(
      <SaveButton text="cog" loading />,
    );
    tree = component.toJSON();
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
});

