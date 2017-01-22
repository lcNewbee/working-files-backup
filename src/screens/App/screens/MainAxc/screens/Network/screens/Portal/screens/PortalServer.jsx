import React from 'react';
import utils from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const listOptions = fromJS([
  {
    id: 'template_name',
    label: _('Server Name'),
    formProps: {
      type: 'text',
      maxLength: '31',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
    },
  }, {
    id: 'address_type',
    label: _('Address Type'),
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: _('IP Address'),
      }, {
        value: '2',
        label: _('Domain'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'server_ipaddr',
    label: _('Server IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
      showPrecondition(data) {
        return data.get('address_type') === '1';
      },
    },

  }, {
    id: 'server_domain',
    label: _('Server Domain'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
      showPrecondition(data) {
        return data.get('address_type') === '2';
      },
    },
  }, {
    id: 'server_port',
    label: _('Server Port'),
    formProps: {
      min: 1,
      max: 65535,
      type: 'number',
      required: true,
    },
  }, {
    id: 'server_key',
    label: _('Shared Key'),
    noTable: true,
    formProps: {
      type: 'password',
      maxLength: '31',
      required: true,
      validator: validator({
        rules: 'pwd',
      }),
    },
  }, {
    id: 'server_url',
    label: _('Redirect URL'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ac_ip',
    label: _('AC IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  },
]);

const propTypes = {};
const defaultProps = {};

export default class View extends React.Component {

  componentWillUnmount() {}

  render() {
    return (
      <AppScreen
        {...this.props}
        listKey="template_name"
        listOptions={listOptions}
        actionable
        selectable
        noTitle
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    settings: state.settings,
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
