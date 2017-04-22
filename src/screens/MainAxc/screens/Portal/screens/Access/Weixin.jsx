import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const uptimeFilter = utils.filter('connectTime');

const listOptions = fromJS([
  {
    id: 'basip',
    text: __('Bas IP'),
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
    text: __('SSID'),
    width: '120px',
    options: [],
    formProps: {
      maxLength: '129',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'shopId',
    text: __('Shop ID'),
    formProps: {
      maxLength: '129',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 129]',
      }),
    },
  }, {
    id: 'appId',
    text: __('App ID'),
    formProps: {
      maxLength: '129',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'domain',
    text: __('Domain'),
    formProps: {
      noAdd: true,
      type: 'text',
      maxLength: '129',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'outTime',
    text: __('Out Time'),
    help: __('Second'),
    formProps: {
      help: __('Second'),
      noAdd: true,
      min: '0',
      max: '99999999',
      type: 'number',
      validator: validator({
        rules: 'num:[0,999999999]',
      }),
      required: true,
    },
    transform(val) {
      return uptimeFilter.transform(val);
    },
  }, {
    id: 'secretKey',
    text: __('Secret Key'),
    noTable: true,
    formProps: {
      type: 'password',
      required: true,
      maxLength: '129',
      validator: validator({
        rules: 'utf8Len:[1, 128]',
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
        searchable
        searchProps={{
          placeholder: `${__('Bas IP')}/SSID`,
        }}
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
