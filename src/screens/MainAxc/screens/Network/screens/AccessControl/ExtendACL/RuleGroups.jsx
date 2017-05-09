import React from 'react';
import { fromJS } from 'immutable';
import { Button, Icon } from 'shared/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import SlideViewer from './SlideViewer';
import Exchange from './Exchange';
import './style.css';

const exchangeListOptions = fromJS([
  {
    id: 'index',
    label: __('Index'),
    showInBox: true,
    type: 'text',
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'name',
    label: __('Name'),
    showInBox: true,
    formProps: {
      type: 'text',
    },
  },
]);

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const slidelist = fromJS([
      {
        id: '1',
        name: 'GROUP1',
      },
      {
        id: '2',
        name: 'GROUP2',
      },
      {
        id: '3',
        name: 'GROeUP3',
      },
      {
        id: '4',
        name: 'GROeeeeeeUP4',
      },
      {
        id: '5',
        name: 'GROUP5',
      },
    ]);

    return (
      <div className="container-grid">
        <div className="row">
          <SlideViewer
            slidedirection="horizontal"
            slidekey="name"
            slidelist={slidelist}
            onSlideBtnClick={(val) => {
              console.log(val);
            }}
          />
          {/* <div className="group-slide-wrap cols col-10 col-offset-1">
            <div className="left-caret cols col-1">
              <Icon
                name="caret-left"
                style={{ color: '#0083cd' }}
                size="4x"
              />
            </div>
            <div className="slide-view cols col-10">
              <div className="group-slide">
                <nobr>
                  <Button
                    theme="primary"
                    text="GROUP1"
                    size="lg"
                    className="group-button"
                  />
                  <Button
                    theme="primary"
                    text="GROUP2"
                    size="lg"
                    className="group-button"
                  />
                  <Button
                    theme="primary"
                    text="GROUP3"
                    size="lg"
                    className="group-button"
                  />
                  <Button
                    theme="primary"
                    text="GROUP4"
                    size="lg"
                    className="group-button"
                  />
                  <Button
                    theme="primary"
                    text="GROUP5"
                    size="lg"
                    className="group-button"
                  />
                  <Button
                    theme="primary"
                    text="GROUP6"
                    size="lg"
                    className="group-button"
                  />
                  <Button
                    theme="primary"
                    text="GROUP7"
                    size="lg"
                    className="group-button"
                  />
                </nobr>
              </div>
            </div>
            <div className="right-caret cols col-1">
              <Icon
                name="caret-right"
                style={{ color: '#0083cd' }}
                size="4x"
              />
            </div>
          </div>*/}
          {/*<div className="group-config-wrap cols col-10 col-offset-1 text-justify">
            <div className="list-in-group cols col-5">
              <div className="list-in-group-head" />
              <div className="list-in-group-body" />
            </div>
            <div className="exchange-arrow cols col-2">
              <Icon
                name="exchange"
                style={{ color: '#0083cd' }}
                size="4x"
              />
            </div>
            <div className="list-out-group cols col-5">
              <div className="list-out-group-head">
                <Icon
                  name="plus"
                  size="2x"
                  style={{ color: '#0083cd' }}
                />
              </div>
              <div className="list-out-group-body" />
            </div>
          </div>*/}
          <Exchange
            leftboxtitle="Left Box"
            rightboxtitle="Right Box"
            rightaddbutton
            leftaddbutton
            listOptions={exchangeListOptions}
            leftboxlist={fromJS([
              { index: '1', name: 'the first rule' },
              { index: '2', name: 'the second rule' },
              { index: '3', name: 'the third rule' },
              { index: '4', name: 'the fourth rule' },
              { index: '1', name: 'the first rule' },
              { index: '2', name: 'the second rule' },
              { index: '3', name: 'the third rule' },
              { index: '4', name: 'the fourth rule' },
              { index: '1', name: 'the first rule' },
              { index: '2', name: 'the second rule' },
              { index: '3', name: 'the third rule' },
              { index: '4', name: 'the fourth rule' },
              { index: '1', name: 'the first rule' },
              { index: '2', name: 'the second rule' },
              { index: '3', name: 'the third rule' },
              { index: '4', name: 'the fourth rule' },
            ])}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
