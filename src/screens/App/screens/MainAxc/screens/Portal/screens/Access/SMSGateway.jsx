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
    text: _('Name'),
    formProps: {
      type: 'text',
      required: true,
      maxLength: '65',
      validator: validator({
        rules: 'utf8Len:[1, 64]',
      }),
    },
  }, {
    id: 'url',
    text: _('URL'),
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
      maxLength: '65',
      validator: validator({
        rules: 'utf8Len:[1, 64]',
      }),
    },
  }, {
    id: 'appKey',
    text: _('App Key'),
    formProps: {
      help: _('gwid,accountid,username'),
      maxLength: '65',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 64]',
      }),
    },
  }, {
    id: 'pwd',
    text: _('Password'),
    formProps: {
      maxLength: '32',
      type: 'password',
      required: true,
      validator: validator({
        rules: 'pwd',
      }),
    },
  }, {
    id: 'serviceID',
    text: _('Template ID'),
    formProps: {
      maxLength: '33',
      help: _('ServiceID, Spcode'),
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 32]',
      }),
    },
  }, {
    id: 'srcTermID',
    text: _('Signature ID'),
    formProps: {
      help: _('srcTermID'),
      type: 'text',
      maxLength: '33',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 32]',
      }),
    },
  }, {
    id: 'companyName',
    text: _('Company Name'),
    formProps: {
      type: 'text',
      maxLength: '33',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 32]',
      }),
    },
  }, {
    id: 'usedTimes',
    text: _('Used Times'),
    noForm: true,
    formProps: {
      type: 'number',
      required: true,
      min: '0',
      max: '99999',
      defaultValue: '5',
      help: _('Times'),
      validator: validator({
        rules: 'num',
      }),
    },
  }, {
    id: 'type',
    text: _('Type'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('On Service'),
      }, {
        value: '1',
        label: _('Out of Service'),
      },
    ],
  }, {
    id: 'state',
    text: _('State'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Allowed'),
      }, {
        value: '1',
        label: _('Forbidden'),
      },
    ],
  }, {
    id: 'multiTerminalLog',
    text: _('MultiTerminal Log'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Allowed'),
      }, {
        value: '1',
        label: _('Forbidden'),
      },
    ],
  }, {
    id: 'overDueDuration',
    text: _('Overdue Duration'),
    formProps: {
      type: 'number',
      min: '0',
      max: '10',
      defaultValue: '5',
      help: _('Minutes'),
      validator: validator({
        rules: 'num',
      }),
    },
  }, {
    id: 'mContent',
    text: _('Message Content'),
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
