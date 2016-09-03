
import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import ListInfo from 'shared/components/Template/ListInfo';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';
import * as listActions from 'shared/actions/list';

const screenOptions = fromJS([
  {
    id: 'serverName',
    label: _('Server Name'),
    formProps: {
      type: 'text',
      maxLength: '32',
      required: true,
    },
  }, {
    id: 'addressType',
    label: _('Address Type'),
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: _('IP'),
      }, {
        value: '1',
        label: _('Domain'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'serverIp',
    label: _('Server IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
      showPrecondition(data) {
        return data.get('addressType') === '0';
      },
    },

  }, {
    id: 'serverDomain',
    label: _('Server Domain'),
    formProps: {
      type: 'text',
      required: true,
      showPrecondition(data) {
        return data.get('addressType') === '1';
      },
    },
  }, {
    id: 'serverPort',
    label: _('Server Port'),
    formProps: {
      type: 'number',
      required: true,
    },
  }, {
    id: 'sharedKey',
    label: _('Shared Key'),
    formProps: {
      type: 'password',
      required: true,
    },
  }, {
    id: 'redirectUrl',
    label: _('Redirect URL'),
    formProps: {
      type: 'text',
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
        store={this.props.list}
        tableOptions={tableOptions}
        editFormOptions={formOptions}
        defaultEditData={defaultEditData}
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
