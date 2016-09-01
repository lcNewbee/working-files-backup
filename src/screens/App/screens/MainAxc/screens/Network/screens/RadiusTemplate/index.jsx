import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as listActions from 'shared/actions/list';

const screenOptions = fromJS([
  {
    id: 'radiusTemplateName',
    label: _('Radius Template Name'),
    formProps: {
      type: 'text',
      className: 'cols col-12',
      maxLength: '32',
      required: true,
    },
  }, {
    id: 'mainIp',
    label: _('Main IP'),
    fieldset: 'auth',
    legend: _('Auth Server Settings'),
    defaultValue: '0',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },

  }, {
    id: 'secondIp',
    label: _('Second IP'),
    fieldset: 'auth',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },
  }, {
    id: 'mainPort',
    label: _('Main Port'),
    fieldset: 'auth',
    defaultValue: '0',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },

  }, {
    id: 'secondPort',
    label: _('Second Port'),
    fieldset: 'auth',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'mainPassword',
    label: _('Main Password'),
    fieldset: 'auth',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },
  }, {
    id: 'secondPassword',
    label: _('Second Password'),
    fieldset: 'auth',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },
  }, {
    id: 'mainAccountingIp',
    label: _('Main IP'),
    fieldset: 'Accounting',
    legend: _('Accounting Server Settings'),
    defaultValue: '0',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },

  }, {
    id: 'secondAccountingIp',
    label: _('Second IP'),
    fieldset: 'Accounting',
    formProps: {
      type: 'text',
      className: 'cols col-6',
    },
  }, {
    id: 'mainAccountingPort',
    label: _('Main Port'),
    fieldset: 'Accounting',
    defaultValue: '0',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },

  }, {
    id: 'secondAccountingPort',
    label: _('Second Port'),
    fieldset: 'Accounting',
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'mainAccountingPassword',
    label: _('Main Password'),
    fieldset: 'Accounting',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },

  }, {
    id: 'secondAccountingPassword',
    label: _('Second Password'),
    fieldset: 'Accounting',
    noTable: true,
    formProps: {
      type: 'password',
      className: 'cols col-6',
    },
  }, {
    id: 'accountingOnStatus',
    label: _('Accounting-on'),
    fieldset: 'parameter',
    legend: _('Parameter Settings'),
    noTable: true,
    formProps: {
      type: 'checkbox',
      className: 'cols col-6',
    },
  }, {
    id: 'userFormat',
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
    id: 'accountingOnSendInterval',
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
    id: 'accountingOnResendTimes',
    label: _('Accounting-on Resend Times'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'packetsMaxSendTimes',
    label: _('Packets Max Send Times'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-12',
    },
  }, {
    id: 'accountingPacketsSendInterval',
    label: _('Accounting Packets Send Interval'),
    fieldset: 'parameter',
    defaultValue: '0',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
      help: _('Minute'),
    },

  }, {
    id: 'silentTime',
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
    id: 'accountingPacketsResendTimes',
    label: _('Accounting Packets Resend Times'),
    fieldset: 'parameter',
    noTable: true,
    formProps: {
      type: 'number',
      className: 'cols col-6',
    },
  }, {
    id: 'responseTimeoutTime',
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
const propTypes = {
  app: PropTypes.instanceOf(Map),
  settings: PropTypes.instanceOf(Map),
  list: PropTypes.instanceOf(Map),
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }
  onSave() {
    this.props.saveSettings();
  }
  render() {
    return (
      <div>
        <ListInfo
          {...this.props}
          store={this.props.list}
          tableOptions={tableOptions}
          modalSize="lg"
          editFormOptions={formOptions}
          defaultEditData={defaultEditData}
          actionable
          selectable
        />
      </div>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    list: state.list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    listActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
