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
import * as screenActions from 'shared/actions/screens';

function getInterfaceTypeOptions() {
  return utils.fetch('goform/interfaceType')
    .then((json) => (
      {
        options: json.data.list.map(
          (item) => ({
            value: item.no,
            label: `${item.no}(${item.noInfo})`,
          })
        ),
      }
    )
  );
}
const commonFormOptions = fromJS([
  {
    id: 'enable',
    label: _('NAT Service'),
    type: 'checkbox',
    text: _('Enable'),
    value: '1',
    saveOnChange: true,
  },
]);
const screenOptions = fromJS([
  {
    id: 'ruleType',
    label: _('NAT Rule Type'),
    options: [
      {
        value: '0',
        label: _('Static Address Transform'),
      }, {
        value: '1',
        label: _('Source Address Transform'),
      }, {
        value: '2',
        label: _('Target Address Transform'),
      }, {
        value: '3',
        label: _('Public IP Transparent Transmission'),
      },
    ],
    formProps: {
      type: 'select',
      label: _('NAT Rule Type'),
      placeholder: _('Please Select ') + _('NAT Rule Type'),
    },

  }, {
    id: 'sourceAddress',
    label: _('Source Address'),
  }, {
    id: 'conversionAddress',
    label: _('Conversion Address'),
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
    return (
      <ListInfo
        {...this.props}
        listTitle={_('NAT Rules List')}
        store={this.props.list}
        settingsFormOption={commonFormOptions}
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
