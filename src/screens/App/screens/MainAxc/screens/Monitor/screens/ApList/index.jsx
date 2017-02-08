import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { radioBase, radioAdvance, numberKeys } from 'shared/config/axcRadio';
import { Button } from 'shared/components/Button';
import AppScreen from 'shared/components/Template/AppScreen';
import FormContainer from 'shared/components/Organism/FormContainer';
import Icon from 'shared/components/Icon';
import { apStatus } from 'shared/config/axcAp';
import validator from 'shared/validator';

// custom
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

const EDIT_LIST_ACTION = 'editList';
const flowRateFilter = utils.filter('flowRate:["KB"]');

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
              label: _('Automatic'),
            })),
          ).set('disabled', true);

        // 功率添加自动选项
        case 'txpower':
          return $$item.updateIn(
            ['options'],
            $$options => $$options.unshift(Map({
              value: 'auto',
              label: _('Automatic'),
            })),
          ).set('disabled', true);

        // 信道只支持自动
        case 'channel':
          return $$item.set(
            'options',
            fromJS([
              {
                value: 0,
                label: _('Automatic'),
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

const $$radioAdvanceFormOptions = radioAdvance.filterNot(
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
const listOptions = fromJS([
  // {
  //   id: 'devicename',
  //   width: '180',
  //   text: `${_('MAC Address')}/${_('Name')}`,
  //   maxLength: '31',
  //   transform(val, item) {
  //     return item.get('devicename') || item.get('mac');
  //   },
  // },
  {
    id: 'devicename',
    width: '180',
    text: _('Name'),
    maxLength: '31',
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  }, {
    id: 'ip',
    width: '160',
    text: _('IP Address'),
  }, {
    id: 'mac',
    width: '160',
    text: _('MAC Address'),
  }, {
    id: 'status',
    text: _('Status'),
    defaultValue: 'unkown',
    options: apStatus,
  }, {
    id: 'connectedNumbers',
    width: '80',
    text: _('Clients'),
  }, {
    id: 'bandwidth',
    width: '80',
    text: _('Data'),
    transform(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}/${downRate}`;
    },
  }, {
    id: 'operationhours',
    text: _('Uptime'),
    width: '80',
    filter: 'connectTime',
  },
]);
const listActionBarButtons = [
  {
    actionName: 'upgrade',
    text: _('Upgrade'),
    icon: 'arrow-circle-o-up',
  }, {
    actionName: 'reboot',
    text: _('Reboot'),
    icon: 'recycle',
  }, {
    actionName: 'reset',
    text: _('Reset'),
    icon: 'reply-all',
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
  addToPropertyPanel: PropTypes.func,
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
      this.props.addToPropertyPanel(actionQuery, item.toJS());
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
        myTitle: _('Edit Selected AP'),
      });
    } else {
      this.props.createModal({
        id: EDIT_LIST_ACTION,
        role: 'alert',
        text: _('Please select %s rows', _('edit')),
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
            {_('Base Settings')}
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
            {_('Advanced Settings')}
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
                hasSaveButton
              />
            </div>
          ) : null
        }
      </div>
    );
  }
  render() {
    const myListOptions = listOptions.setIn([0, 'transform'], (val, $$item) => {
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
        text={_('Edit')}
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
