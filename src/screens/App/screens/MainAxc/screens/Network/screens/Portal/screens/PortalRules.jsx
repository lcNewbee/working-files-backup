import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import ListInfo from 'shared/components/Template/ListInfo';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';
import * as listActions from 'shared/actions/list';

const commonFormOptions = fromJS([
  {
    id: 'serverName',
    label: _('Server Name'),
    type: 'select',
    legend: _('Base Settings'),
    options: [
      {

      },
    ],
  }, {
    id: 'maxUser',
    label: _('Max Users'),
    type: 'text',
  }, {
    id: 'authType',
    label: _('Auth Type'),
    type: 'switch',
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: _('Direct'),
      },
      {
        value: '1',
        label: _('Layer3'),
      },
    ],
  }, {
    id: 'authSegmentIp',
    label: _('Auth Segment Ip'),
    type: 'text',
    showPrecondition(data) {
      return data.get('authType') === '1';
    },
  }, {
    id: 'authSegmentMask',
    label: _('Auth Segment Mask'),
    type: 'text',
    showPrecondition(data) {
      return data.get('authType') === '1';
    },
  }, {
    id: 'forceAuthDomain',
    label: _('Force Auth Domain'),
    type: 'text',
  }, {
    id: 'idleDetection',
    label: _('Idle Detection'),
    type: 'checkbox',
  },
]);
const screenOptions = fromJS([
  {
    id: 'ruleName',
    label: _('Rule Name'),
    formProps: {
      type: 'text',
      maxLength: '32',
      required: true,
    },
  }, {
    id: 'ruleAction',
    label: _('Rule Action'),
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: _('Allow'),
      }, {
        value: '1',
        label: _('Prevent'),
      },
    ],
    formProps: {
      type: 'switch',
    },

  }, {
    id: 'addressType',
    label: _('Address Type'),
    options: [
      {
        value: '1',
        label: _('Source Address'),
      }, {
        value: '2',
        label: _('Target Address'),
      },
    ],
    formProps: {
      type: 'select',
      label: _('Rule Type'),
      placeholder: _('Please Select ') + _('NAT Rule Type'),
    },

  }, {
    id: 'ipAddress',
    label: _('IP Address'),
    formProps: {
      required: true,
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

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }
  onSave() {
    this.props.saveSettings();
  }

  render() {
    return (
      <ListInfo
        {...this.props}
        listTitle={_('Portal Rules List')}
        store={this.props.list}
        tableOptions={tableOptions}
        settingsFormOption={commonFormOptions}
        editFormOptions={formOptions}
        defaultEditData={defaultEditData}
        hasSettingsSaveButton
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
    list: state.list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
    listActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
