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
    id: 'name',
    text: __('Name'),
    formProps: {
      type: 'text',
      required: true,
      maxLength: '129',
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'url',
    text: __('URL'),
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
      maxLength: '256',
      validator: validator({
        rules: 'utf8Len:[1, 255]',
      }),
    },
  }, {
    id: 'appkey',
    text: __('App Key'),
    formProps: {
      help: __('gwid,accountid,username'),
      maxLength: '129',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'appsecret',
    text: __('Password'),
    formProps: {
      maxLength: '128',
      type: 'password',
      required: true,
      validator: validator({
        rules: 'pwd',
      }),
    },
  }, {
    id: 'smstemplate',
    text: __('Template ID'),
    formProps: {
      maxLength: '256',
      help: __('ServiceID, Spcode'),
      type: 'text',
      validator: validator({
        rules: 'utf8Len:[1, 255]',
      }),
    },
  }, {
    id: 'smssign',
    text: __('Signature ID'),
    formProps: {
      help: __('srcTermID'),
      type: 'text',
      maxLength: '33',
      validator: validator({
        rules: 'utf8Len:[1, 32]',
      }),
    },
  }, {
    id: 'company',
    text: __('Company Name'),
    formProps: {
      type: 'text',
      maxLength: '33',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 32]',
      }),
    },
  }, {
    id: 'count',
    text: __('Used Times'),
    noForm: true,
    formProps: {
      type: 'number',
      required: true,
      min: '0',
      max: '99999',
      defaultValue: '5',
      help: __('Times'),
      validator: validator({
        rules: 'num:[0,99999]',
      }),
    },
  }, {
    id: 'type',
    text: __('Type'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '1',
        label: __('Virtual Gateway'),
      }, {
        value: '2',
        label: __('Qianhai Smart Commumication'),
      },
    ],
  }, {
    id: 'state',
    text: __('State'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '1',
        label: __('On Service'),
      }, {
        value: '0',
        label: __('Out of Service'),
      },
    ],
  }, {
    id: 'more',
    text: __('MultiTerminal Log'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Allowed'),
      }, {
        value: '1',
        label: __('Forbidden'),
      },
    ],
  }, {
    id: 'time',
    text: __('Overdue Duration'),
    formProps: {
      type: 'number',
      min: '0',
      max: '10',
      defaultValue: '5',
      help: __('Minutes'),
      validator: validator({
        rules: 'num:[0,10]',
      }),
    },
  }, {
    id: 'text',
    text: __('Message Content'),
    noTable: true,
    formProps: {
      type: 'textarea',
      required: true,
      maxLength: '257',
      validator: validator({
        rules: 'utf8Len:[1, 256]',
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
