import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag,
  Simulate
} from 'react-addons-test-utils';
import {List, Map, formJS} from 'immutable';
import { Login } from '../../../../src/pages/Login/index';
import chai, { expect } from 'chai';

const should = chai.should();

describe('Login', () => {

  it('renders as a pure component', () => {
    let data = {
      username: 'ddsd',
      password: 'ddddd'
    };
    const container = document.createElement('div');
    let component = ReactDOM.render(
      <Login data={data} />,
      container
    );
    let firstInput = scryRenderedDOMComponentsWithTag(component, 'input')[0];

    firstInput.value.should.equal('ddsd');

    data.username = 'Sunshine';
    component = ReactDOM.render(
      <Login data={data} />,
      container
    );
    firstInput = scryRenderedDOMComponentsWithTag(
        component,
        'input'
    )[0];
    firstInput.value.should.equal('ddsd');
  });

  it('does update DOM when prop changes', () => {
    const data = Map({
      username: 'd',
      password: 'dd',
      as: 23
    });

    const container = document.createElement('div');
    let component = ReactDOM.render(
      <Login data={data} />,
      container
    );

    let firstInput = scryRenderedDOMComponentsWithTag(component, 'input')[0];
    expect(firstInput.value).to.equal('d');

    const newData = data.update('username', val => 'dddsds');
    component = ReactDOM.render(
      <Login data={newData} />,
      container
    );
    firstInput = scryRenderedDOMComponentsWithTag(component, 'input')[0];

    firstInput.value.should.equal('dddsds');
  });

});