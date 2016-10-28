import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import ListInfo from 'shared/components/Template/ListInfo';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const screenOptions = fromJS([
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
    label: _('Main IP'),
    fieldset: 'auth',
    legend: _('Auth Server Settings'),
    defaultValue: '0',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },

  }, {
    id: 'authsecond_ipaddr',
    label: _('Second IP'),
    fieldset: 'auth',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },
  }, {
    id: 'authpri_port',
    label: _('Main Port'),
    fieldset: 'auth',
    defaultValue: '0',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },

  }, {
    id: 'authsecond_port',
    label: _('Second Port'),
    fieldset: 'auth',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'authpri_key',
    label: _('Main Password'),
    fieldset: 'auth',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },
  }, {
    id: 'authsecond_key',
    label: _('Second Password'),
    fieldset: 'auth',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },
  }, {
    id: 'acctpri_ipaddr',
    label: _('Main IP'),
    fieldset: 'Accounting',
    legend: _('Accounting Server Settings'),
    defaultValue: '0',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },

  }, {
    id: 'acctsecond_ipaddr',
    label: _('Second IP'),
    fieldset: 'Accounting',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },
  }, {
    id: 'acctpri_port',
    label: _('Main Port'),
    fieldset: 'Accounting',
    defaultValue: '0',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },

  }, {
    id: 'acctsecond_port',
    label: _('Second Port'),
    fieldset: 'Accounting',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'acctpri_key',
    label: _('Main Password'),
    fieldset: 'Accounting',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },

  }, {
    id: 'acctsecond_key',
    label: _('Second Password'),
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
    legend: _('Parameter Settings'),
    noTable: true,
    formProps: {
      type: 'checkbox',
      className: 'cols col-6',
    },
  }, {
    id: 'username_format',
    label: _('User Format'),
    fieldset: 'parameter',
    noTable: true,
    options: [
      {
        value: 'WITHOUT_DOMAIN',
        label: 'WITHOUT_DOMAIN',
      }, {
        value: 'WITH_DOMAN ',
        label: 'WITH_DOMAN',
      }, {
        value: 'KEEP_ORIGINAL',
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
    label: _('Accounting-on Send Interval'),
    fieldset: 'parameter',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
      help: _('Seconds'),
    },

  }, {
    id: 'realretrytimes',
    label: _('Accounting-on Resend Times'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'accton_sendtimes',
    label: _('Packets Max Send Times'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-12',
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
    id: 'resp_time',
    label: _('Accounting Resend Times'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'retry_times',
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

const formOptions = immutableUtils.getFormOptions(screenOptions);
const tableOptions = immutableUtils.getTableOptions(screenOptions);
const defaultEditData = immutableUtils.getDefaultData(screenOptions);
const propTypes = {};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ListInfo
        {...this.props}
        store={this.props.store}
        tableOptions={tableOptions}
        modalSize="lg"
        editFormOptions={formOptions}
        defaultEditData={defaultEditData}
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
