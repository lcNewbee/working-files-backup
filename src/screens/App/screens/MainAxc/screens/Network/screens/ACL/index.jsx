import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormContainer, ListInfo,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';
import * as listActions from 'shared/actions/list';

const commonFormOptions = fromJS([
  {
    id: 'enable',
    label: _('Enable ACL'),
    type: 'checkbox',
    text: _('Enable'),
    value: '1',
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
  componentWillMount() {
    const props = this.props;
    const groupId = props.groupId || -1;

    props.initSettings({
      settingId: props.route.id,
      formUrl: props.route.formUrl,
      query: {
        groupId,
      },
      defaultData: {
        enable: '1',
      },
    });

    props.fetchSettings();
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }
  onSave() {
    this.props.saveSettings();
  }

  render() {
    const { app, route, updateItemSettings, saveSettings } = this.props;
    const curData = this.props.settings.getIn(['curData']);

    if (this.props.settings.get('curSettingId') === 'base') {
      return null;
    }
    return (
      <div>
        <FormContainer
          options={commonFormOptions}
          data={curData}
          onChangeData={updateItemSettings}
          onSave={saveSettings}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          isSaving={app.get('saving')}
          // hasSaveButton
        />

        <ListInfo
          {...this.props}
          title={_('ACL Rules List')}
          store={this.props.list}
          tableOptions={tableOptions}
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
