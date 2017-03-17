import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const uptimeFilter = utils.filter('connectTime');
const listOptions = fromJS([
  {
    id: 'basip',
    text: _('Bas IP'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'ssid',
    text: _('SSID'),
    width: '120px',
    options: [],
    formProps: {
      maxLength: '32',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
    },
  }, {
    id: 'shopId',
    text: _('Shop ID'),
    formProps: {
      maxLength: '32',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
    },
  }, {
    id: 'appId',
    text: _('App ID'),
    formProps: {
      maxLength: '32',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
    },
  }, {
    id: 'domain',
    text: _('Domain'),
    noForm: true,
    formProps: {
      noAdd: true,
      type: 'text',
      maxLength: '32',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
    },
  }, {
    id: 'outTime',
    text: _('Out Time'),
    noForm: true,
    formProps: {
      min: '0',
      max: '99999999',
      type: 'number',
      required: true,
    },
    transform(val) {
      return uptimeFilter.transform(val / 1000);
    },
  }, {
    id: 'secretKey',
    text: _('Secret Key'),
    noTable: true,
    formProps: {
      type: 'password',
      required: true,
      maxLength: '32',
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
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
        deleteable={
          ($$item, index) => (index !== 0)
        }
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
