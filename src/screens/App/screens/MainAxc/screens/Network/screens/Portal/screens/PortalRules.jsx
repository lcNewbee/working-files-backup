import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import Modal from 'shared/components/Modal';
import Table from 'shared/components/Table';
import WizardContainer from 'shared/components/Organism/WizardContainer';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const commonFormOptions = fromJS([
  {
    id: 'template_name',
    label: _('Server Name'),
    type: 'select',
    legend: _('Base Settings'),
    options: [
      {

      },
    ],
  }, {
    id: 'max_usernum',
    label: _('Max Users'),
    type: 'text',
  }, {
    id: 'auth_mode',
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
    id: 'auth_ip',
    label: _('Auth Segment Ip'),
    type: 'text',
    showPrecondition(data) {
      return data.get('authType') === '1';
    },
  }, {
    id: 'auth_mask',
    label: _('Auth Segment Mask'),
    type: 'text',
    showPrecondition(data) {
      return data.get('authType') === '1';
    },
  }, {
    id: 'auth_domain',
    label: _('Force Auth Domain'),
    type: 'text',
  }, {
    id: 'idle_test',
    label: _('Idle Detection'),
    type: 'checkbox',
  }, {
    id: 'interface_bind',
    label: _('Interface Bind'),
    type: 'select',
    legend: _('Base Settings'),
    options: [
      {

      },
    ],
  },
]);
const listOptions = fromJS([
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

const objectTableOptions = fromJS([
  {
    id: 'nickName',
    label: _('Nickname'),
  }, {
    id: 'occurrenceTime',
    label: _('Occurrence Time'),
  }, {
    id: 'recentlyAppeared',
    label: _('Recently Appeared'),
  }, {
    id: 'createtime',
    label: _('Createtime'),
  },
]);

const formOptions = immutableUtils.getFormOptions(listOptions);
const tableOptions = immutableUtils.getTableOptions(listOptions);
const defaultEditData = immutableUtils.getDefaultData(listOptions);
const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  route: PropTypes.object,
  closeListItemModal: PropTypes.func,
  updateItemSettings: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.renderStepOne = this.renderStepOne.bind(this);
  }

  onSave() {
    this.props.saveSettings();
  }

  onBeforeStep(data) {
    // next
    if (data.targetStep > data.currStep) {

    } else {
      console.log('prev');
    }
  }

  onAfterStep(data) {
    // next
    if (data.currStep) {
      console.log(data.currStep);
    }
  }

  renderStepOne() {
    return (
      <Table
        className="table"
        options={objectTableOptions}
        list={[]}
      />
    );
  }

  render() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const actionQuery = store.getIn([myScreenId, 'actionQuery']);
    const actionType = store.getIn([myScreenId, 'actionQuery', 'action']);
    const showModel = actionType === 'add' || actionType === 'edit';
    return (
      <AppScreen
        {...this.props}
        listTitle={_('Portal Rules List')}
        store={store}
        listOptions={listOptions}
        settingsFormOptions={commonFormOptions}
        hasSettingsSaveButton
        actionable
        selectable
        noTitle

      >
        <Modal
          isShow={showModel}
          title={actionQuery.get('myTitle')}
          onOk={this.onSave}
          onClose={this.props.closeListItemModal}
          size="lg"
          noFooter
        >
          <WizardContainer
            title={_('Portal Rule Setup Wizard')}
            options={
              fromJS([
                {
                  title: _('Select Rule Object'),
                  render: this.renderStepOne,
                }, {
                  title: _('Set Rule Trigger Condition'),
                  render() {
                    return 'dsds';
                  },
                }, {
                  title: _('Set Rule Trigger Action Condition'),
                  render() {
                    return 'dsds';
                  },
                }, {
                  title: _('Completed'),
                  render() {
                    return 'dsds';
                  },
                },
              ])
            }
            size="sm"
            onBeforeStep={this.onBeforeStep}
            onAfterStep={this.onAfterStep}
            onCompleted={(data) => console.log('onCompleted', data)}
          />
        </Modal>
      </AppScreen>
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
