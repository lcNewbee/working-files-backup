import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'basip',
    text: _('Bas IP'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ssid',
    text: _('SSID'),
    width: '120px',
    options: [],
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'shopId',
    text: _('Shop ID'),
    formProps: {
      type: 'number',
      required: true,
    },
  }, {
    id: 'appId',
    text: _('App ID'),
    formProps: {
      type: 'number',
      required: true,
    },
  }, {
    id: 'domain',
    text: _('Domain'),
    noForm: true,
    formProps: {
      noAdd: true,
      type: 'text',
      required: true,
    },
  }, {
    id: 'outTime',
    text: _('Out Time'),
    noForm: true,
    formProps: {
      type: 'number',
      required: true,
    },
  }, {
    id: 'secretKey',
    text: _('Secret Key'),
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
    },
  },
]);

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};
export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        noTitle
        actionable
        selectable
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

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


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
