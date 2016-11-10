
import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import ListInfo from 'shared/components/Template/ListInfo';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';
import * as screenActions from 'shared/actions/screens';

const screenOptions = fromJS([
  {
    id: 'template_name',
    label: _('Server Name'),
    formProps: {
      type: 'text',
      maxLength: '32',
      required: true,
    },
  }, {
    id: 'address_type',
    label: _('Address Type'),
    defaultValue: '0',
    options: [
      {
        value: '1',
        label: _('IP'),
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
      showPrecondition(data) {
        return data.get('address_type') === '2';
      },
    },
  }, {
    id: 'server_port',
    label: _('Server Port'),
    formProps: {
      type: 'number',
      required: true,
    },
  }, {
    id: 'server_key',
    label: _('Shared Key'),
    noTable: true,
    formProps: {
      type: 'password',
      required: true,
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
        listKey="template_name"
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
    list: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
    screenActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
