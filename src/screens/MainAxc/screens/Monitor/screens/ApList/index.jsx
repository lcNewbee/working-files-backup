import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { radioBase, radioAdvance, radioQos, numberKeys } from 'shared/config/axcRadio';
import { Button } from 'shared/components/Button';

import FormContainer from 'shared/components/Organism/FormContainer';
import Icon from 'shared/components/Icon';
import { apStatus } from 'shared/config/axcAp';
import validator from 'shared/validator';

// custom
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';

const EDIT_LIST_ACTION = 'editList';
const flowRateFilter = utils.filter('flowRate');

const settingsFormOptions = radioBase
  // 添加自动功率
  .map(
    ($$item) => {
      const curId = $$item.get('id');

      switch (curId) {
        // 功率添加自动选项
        case 'phymode':
          return $$item.updateIn(
            ['options'],
            $$options => $$options.unshift(Map({
              value: 'auto',
              label: __('Automatic'),
            })),
          ).set('disabled', true);

        // 功率添加自动选项
        case 'txpower':
          return $$item.updateIn(
            ['options'],
            $$options => $$options.unshift(Map({
              value: 'auto',
              label: __('Automatic'),
            })),
          ).set('disabled', true);

        // 信道只支持自动
        case 'channel':
          return $$item.set(
            'options',
            fromJS([
              {
                value: 0,
                label: __('Automatic'),
              },
            ]),
          ).set('disabled', true);

        // 5G优先,  11n优先
        case 'first5g':
        case 'switch11n':
          return $$item.set(
              'label',
              $$item.get('text'),
            ).delete('text');

        default:
      }

      return $$item;
    },
  )
  .rest()
  .butLast()
  .groupBy(
    item => item.get('fieldset'),
  )
  .toList();

let $$radioAdvanceFormOptions = radioAdvance.filterNot(
  ($$item) => {
    let ret = false;
    const curId = $$item.get('id');

    if (curId === 'rateset' || curId === 'txchain' ||
        curId === 'rxchain') {
      ret = true;
    }

    return ret;
  },
);

// 处理大于 2.5的版本
if (window.guiConfig.versionCode >= 20500) {
  $$radioAdvanceFormOptions = $$radioAdvanceFormOptions.concat(radioQos);
}
const listOptions = fromJS([
  {
    id: 'devicename',
    width: 180,
    text: __('Name'),
    maxLength: '31',
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  }, {
    id: 'ip',
    width: 160,
    text: __('IP Address'),
  }, {
    id: 'mac',
    width: 160,
    text: __('MAC Address'),
  }, {
    id: 'status',
    text: __('Status'),
    defaultValue: 'unkown',
    options: apStatus,
  }, {
    id: 'model',
    text: __('AP Model'),
  }, {
    id: 'connectedNumbers',
    width: 80,
    text: __('Clients'),
  }, {
    id: 'bandwidth',
    width: 80,
    text: __('Data'),
    render(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}↑/${downRate}↓`;
    },
  }, {
    id: 'operationhours',
    text: __('Uptime'),
    width: 80,
    filter: 'connectTime',
  },
]);
const listActionBarButtons = [
  {
    actionName: 'upgrade',
    text: __('Upgrade'),
    icon: 'arrow-circle-o-up',
  }, {
    actionName: 'reboot',
    text: __('Reboot'),
    icon: 'power-off',
  }, {
    actionName: 'reset',
    text: __('Reset'),
    icon: 'undo',
  },
];

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,

  closeModal: PropTypes.func.isRequired,
  validateAll: PropTypes.func,
  fetchScreenData: PropTypes.func,
  saveScreenSettings: PropTypes.func,
  addPropertyPanel: PropTypes.func,
  updateScreenSettings: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  onListAction: PropTypes.func,
  createModal: PropTypes.func,
  groupid: PropTypes.any,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSettingsData: {
        first5g: 1,
        switch11n: 1,
        txpower: 'auto',
        countrycode: 'CN',
        channel: 0,
        channelwidth: 40,
        groupid: props.groupid,
      },

      isBaseShow: true,
      isAdvancedShow: false,
    };

    utils.binds(this, [
      'renderCustomModal',
      'onAction',
      'onSave',
      'toggleBox',
    ]);
    this.screenId = props.route.id;
  }

  componentDidMount() {
    this.props.fetchScreenData({
      url: 'goform/group/smartRf',
    });
  }

  onAction(type, item) {
    const actionQuery = {
      groupid: this.props.groupid,
    };
    if (type === 'edit') {
      actionQuery.mac = item.get('mac');
      this.props.addPropertyPanel(actionQuery, item.toJS());
    } else {
      actionQuery.mac = item;
      actionQuery.action = type;
      actionQuery.operate = type;
      this.props.changeScreenActionQuery(actionQuery);
      this.props.onListAction();
    }
  }

  onSettingSelected() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$selectedList = $$myScreenStore.getIn(['actionQuery', 'selectedList']);

    if ($$selectedList.size > 0) {
      this.props.changeScreenActionQuery({
        action: EDIT_LIST_ACTION,
        myTitle: __('Edit Selected AP'),
      });
      this.props.fetchScreenData({
        url: 'goform/group/smartRf',
      });
    } else {
      this.props.createModal({
        id: EDIT_LIST_ACTION,
        role: 'alert',
        text: __('Please select %s rows', __('edit')),
      });
    }
  }
  onSave(formId) {
    const $$apList = this.props.store.getIn([
      this.screenId,
      'data',
      'list',
    ]);
    const selectedMacList = this.props.store.getIn([
      this.screenId,
      'actionQuery',
      'selectedList',
    ]).map(
      index => $$apList.getIn([index, 'mac']),
    );

    if (this.props.validateAll) {
      this.props.validateAll(formId)
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            this.props.saveScreenSettings({
              url: 'goform/group/ap/radio',
              onlyChanged: true,
              numberKeys: fromJS(numberKeys),
              data: {
                action: EDIT_LIST_ACTION,
                selectedList: selectedMacList,
              },
            }).then(
              () => {
                this.props.closeModal();
                this.props.changeScreenActionQuery({
                  action: '',
                });
              },
            );
          }
        });
    }
  }
  toggleBox(moduleName) {
    this.setState({
      [moduleName]: !this.state[moduleName],
    });
  }
  renderCustomModal() {
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curData = $$myScreenStore.get('curSettings');
    const isEditList = $$myScreenStore.getIn(['actionQuery', 'action']) === EDIT_LIST_ACTION;

    if (!isEditList) {
      return null;
    }

    return (
      <div className="o-box row">
        <div className="o-box__cell">
          <h3
            style={{ cursor: 'pointer' }}
            onClick={() => this.toggleBox('isBaseShow')}
          >
            <Icon
              name={this.state.isBaseShow ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
            />
            {__('Base Settings')}
          </h3>
        </div>
        {
          this.state.isBaseShow ? (
            <div className="o-box__cell">
              <FormContainer
                id="radioBase"
                options={settingsFormOptions}
                data={$$curData}
                onChangeData={this.props.updateScreenSettings}
                onSave={() => this.onSave('radioBase')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                isSaving={app.get('saving')}
                saveText={__('Apply')}
                savingText={__('Applying')}
                savedText={__('Applied')}
              />
            </div>
          ) : null
        }

        <div className="o-box__cell">
          <h3
            style={{ cursor: 'pointer' }}
            onClick={() => this.toggleBox('isAdvancedShow')}
          >
            <Icon
              name={this.state.isAdvancedShow ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
              onClick={() => this.toggleBox('isAdvancedShow')}
            />
            {__('Advanced Settings')}
          </h3>
        </div>
        {
          this.state.isAdvancedShow ? (
            <div className="o-box__cell">
              <FormContainer
                id="radioAdvance"
                options={$$radioAdvanceFormOptions}
                data={$$curData}
                onChangeData={this.props.updateScreenSettings}
                onSave={() => this.onSave('radioAdvance')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                isSaving={app.get('saving')}
                saveText={__('Apply')}
                savingText={__('Applying')}
                savedText={__('Applied')}
                hasSaveButton
              />
            </div>
          ) : null
        }
      </div>
    );
  }
  render() {
    const myListOptions = listOptions.setIn([0, 'render'], (val, $$item) => {
      const mac = $$item.get('mac');
      const statusVal = $$item.get('status');
      let ret = (
        <span
          onClick={() => this.onAction('edit', $$item)}
          className="link-text"
        >
          { $$item.get('devicename') || mac }
        </span>
      );

      if (statusVal === 'new') {
        ret = $$item.get('devicename') || mac;
      }

      return ret;
    });
    let listActionBarChildren = (
      <Button
        text={__('Edit')}
        key="settingActionButton"
        icon="cog"
        onClick={() => this.onSettingSelected()}
      />
    );
    let myActionButtons = listActionBarButtons;

    // 如果是所有组不支持对AP的操作
    if (this.props.groupid === -100) {
      listActionBarChildren = null;
      myActionButtons = [];
    }

    return (
      <AppScreen
        {...this.props}
        listOptions={myListOptions}
        actionBarButtons={myActionButtons}
        actionBarChildren={listActionBarChildren}
        modalChildren={this.renderCustomModal()}
        listKey="mac"
        addable={false}
        editable={false}
        deleteable={false}
        selectable
        actionable
        searchable
        searchProps={{
          placeholder: `${__('Name')}/MAC`,
        }}
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
    apList: state.product.get('devices'),
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
    propertiesActions,
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
