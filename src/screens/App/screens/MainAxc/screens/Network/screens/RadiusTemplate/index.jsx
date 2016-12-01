import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const listOptions = fromJS([
  {
    id: 'template_name',
    label: _('Name'),
    formProps: {
      type: 'text',
      className: 'cols col-12',
      maxLength: '32',
      required: true,
    },
  }, {
    id: 'authpri_ipaddr',
    label: _('Primary IP'),
    fieldset: 'auth',
    legend: _('Auth Server Settings'),
    defaultValue: '0',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },

  }, {
    id: 'authsecond_ipaddr',
    label: _('Secondly IP'),
    fieldset: 'auth',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },
  }, {
    id: 'authpri_port',
    label: _('Primary Port'),
    fieldset: 'auth',
    defaultValue: '0',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },

  }, {
    id: 'authsecond_port',
    label: _('Secondly Port'),
    fieldset: 'auth',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'authpri_key',
    label: _('Primary Password'),
    fieldset: 'auth',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },
  }, {
    id: 'authsecond_key',
    label: _('Secondly Password'),
    fieldset: 'auth',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },
  }, {
    id: 'acctpri_ipaddr',
    label: _('Primary IP'),
    fieldset: 'Accounting',
    legend: _('Accounting Server Settings'),
    defaultValue: '0',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },

  }, {
    id: 'acctsecond_ipaddr',
    label: _('Secondly IP'),
    fieldset: 'Accounting',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },
  }, {
    id: 'acctpri_port',
    label: _('Primary Port'),
    fieldset: 'Accounting',
    defaultValue: '0',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },

  }, {
    id: 'acctsecond_port',
    label: _('Secondly Port'),
    fieldset: 'Accounting',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'acctpri_key',
    label: _('Primary Password'),
    fieldset: 'Accounting',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },

  }, {
    id: 'acctsecond_key',
    label: _('Secondly Password'),
    fieldset: 'Accounting',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },
  }, {
    id: 'accton_enable',
    label: _('Accounting-on'),
    fieldset: 'parameter',
    legend: _('Advanced Settings'),
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'checkbox',
      className: 'cols col-6',
    },
  }, {
    id: 'username_format',
    label: _('User Format'),
    fieldset: 'parameter',
    defaultValue: 'WITH',
    noTable: true,
    options: [
      {
        value: 'WITHOUT',
        label: 'WITHOUT_DOMAIN',
      }, {
        value: 'WITH',
        label: 'WITH_DOMAN',
      }, {
        value: 'UNCHANGE',
        label: 'KEEP_ORIGINAL',
      },
    ],
    formProps: {
      type: 'select',
      className: 'cols col-6',
      placeholder: _('Please Select ') + _('User Format'),
    },
  }, {
    id: 'accton_sendinterval',
    label: _('Accounting-on Interval'),
    fieldset: 'parameter',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
      help: _('Seconds'),
    },

  }, {
    id: 'accton_sendtimes',
    label: _('Accounting-on Resend Times'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'retry_times',
    label: _('Max Messaging Times'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'nasip',
    label: _('Nas IP'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },
  }, {
    id: 'acct_interim_interval',
    label: _('Accounting Send Interval'),
    fieldset: 'parameter',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
      help: _('Minute'),
    },

  }, {
    id: 'quiet_time',
    label: _('Silent Time'),
    fieldset: 'parameter',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
      help: _('Minute'),
    },

  }, {
    id: 'realretrytimes',
    label: _('Accounting Resend Times'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'resp_time',
    label: _('Response Timeout Time'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
      help: _('Seconds'),
    },
  },
]);

const formOptions = immutableUtils.getFormOptions(listOptions);
const tableOptions = immutableUtils.getTableOptions(listOptions);
const defaultEditData = immutableUtils.getDefaultData(listOptions);
const propTypes = {};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        title={_('Radius Profile')}
        store={this.props.store}
        listOptions={listOptions}
        modalSize="lg"
        listKey="template_name"
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
    screenActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
