import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import validator from 'shared/validator';
import moment from 'moment';
import FormContainer from 'shared/components/Organism/FormContainer';
import Icon from 'shared/components/Icon';
// custom
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';
import { Button } from 'shared/components/Button';

const uptimeFilter = utils.filter('connectTime');
const flowFilter = utils.filter('flowRate');
const curDate = {
  date: moment().add(1, 'days').format('YYYY-MM-DD'),
};
const queryFormOptions = fromJS([
  {
    id: 'state',
    type: 'select',
    label: __('Account Type'),
    options: [
      {
        value: '-100',
        label: __('ALL'),
      },
      {
        value: '0',
        label: __('Deactivated'),
      }, {
        value: '1',
        label: __('Free'),
      },
      {
        value: '2',
        label: __('Time-based'),
      }, {
        value: '3',
        label: __('Buy Out'),
      }, {
        value: '4',
        label: __('Traffic'),
      },
    ],
    saveOnChange: true,
  },
]);
// 列表相关配置
const listOptions = fromJS([
  {
    id: 'loginName',
    text: __('Username'),
  }, {
    id: 'date',
    text: __('Expiration'),
    defaultValue: curDate.date,
    noForm: true,
    render(val, $$data) {
      const accountType = $$data.get('state');
      let ret = val;

       // 禁用
      if (accountType === '0' || accountType === '2') {
        ret = '--';

      // 流量
      } else if (accountType === '4') {
        ret = __('Limitless');

      // 免费
      } else if (accountType === '1') {
        ret = __('Limitless');
      }

      return ret;
    },
  }, {
    id: 'time',
    text: __('Time Quota'),
    noForm: true,
    render(val, $$data) {
      const accountType = $$data.get('state');
      let ret = uptimeFilter.transform(val / 1000);

      // 禁用
      if (accountType === '0' || accountType === '3') {
        ret = '--';

      // 流量
      } else if (accountType === '4') {
        ret = __('Limitless');

      // 免费
      } else if (accountType === '1') {
        ret = __('Limitless');
      }

      return ret;
    },
  }, {
    id: 'octets',
    text: __('Data Quota'),
    noForm: true,
    render(val, $$data) {
      const accountType = $$data.get('state');
      let ret = flowFilter.transform(val);

       // 禁用
      if (accountType === '0') {
        ret = '-';

      // 流量
      } else if (accountType !== '4') {
        ret = __('Limitless');
      }

      return ret;
    },
  }, {
    id: 'password',
    text: __('Password'),
    type: 'pwd',
    noTable: true,
  }, {
    id: 'ex1',
    text: __('Question'),
    noTable: true,
  }, {
    id: 'ex2',
    text: __('Answer'),
    noTable: true,
    type: 'text',
  }, {
    id: 'state',
    type: 'text',
    text: __('Account Type'),
    options: [
      {
        value: '0',
        label: __('Deactivated'),
      }, {
        value: '1',
        label: __('Free'),
      },
      {
        value: '2',
        label: __('Time-based'),
      }, {
        value: '3',
        label: __('Buy Out'),
      }, {
        value: '4',
        label: __('Data-based'),
      },
    ],
    defaultValue: '0',
  },
  {
    id: 'maclimit',
    text: __('Multi Device Login'),
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    defaultValue: '0',
  },
  {
    id: 'maclimitcount',
    text: __('MAC Quantity'),
    noTable: true,
  },
  {
    id: 'autologin',
    text: __('Auto Re-login'),
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    defaultValue: '0',
  },
  {
    id: 'speed',
    text: __('Speed Limit'),
    noForm: true,
    noTable: true,
    options: [
      {
        value: '1',
        label: __('1M'),
      },
    ],
    defaultValue: '1',
  },
  {
    id: 'ex4',
    text: __('Last Unbind Month'),
    noForm: true,
    noTable: true,
  },
  {
    id: 'ex3',
    text: __('Unbind Times'),
    noForm: true,
    noTable: true,
  },
  {
    id: 'name',
    text: __('Name'),
    noTable: true,
  },
  {
    id: 'gender',
    text: __('Gender'),
    noTable: true,
    options: [
      {
        value: '0',
        label: __('Male'),
      }, {
        value: '1',
        label: __('Female'),
      },
    ],
    defaultValue: '0',
  },
  {
    id: 'idnumber',
    text: __('ID No.'),
    noTable: true,
  },
  {
    id: 'phoneNumber',
    text: __('Phone'),
    noTable: true,
  }, {
    id: 'address',
    text: __('Address'),
    noTable: true,
  },
  {
    id: 'email',
    text: __('Email'),
    noTable: true,
  },
  {
    id: 'description',
    text: __('Detail Information'),
    noTable: true,
  },
  {
    id: '__actions__',
    text: __('Actions'),
    render(val, $$item) {
      return (
        <span>
          <a
            href={`/index.html#/main/portal/account/list/mac/${$$item.get('loginName')}`}
            className="tablelink"
          >
            {__('MAC Management')}
          </a>
        </span>
      );
    },
  },
]);
const baseSetting = fromJS([
  {
    id: 'loginName',
    label: __('Username'),
    type: 'text',
    required: true,
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  },
  {
    id: 'password',
    label: __('Password'),
    type: 'password',
    noTable: true,
    required: true,
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  },
  {
    id: 'state',
    label: __('Account Type'),
    options: [
      {
        value: '0',
        label: __('Deactivated'),
      }, {
        value: '1',
        label: __('Free'),
      },
      {
        value: '2',
        label: __('Time-based'),
      }, {
        value: '3',
        label: __('Buy Out'),
      }, {
        value: '4',
        label: __('Traffic'),
      },
    ],
    defaultValue: '0',
    type: 'select',
    required: true,
    placeholder: __('Please Select ') + __('Type'),
  },
  {
    id: 'date',
    label: __('Expiration'),
    type: 'date',
    required: true,
    defaultValue: curDate.date,
    visible: $$data => $$data.get('state') === '3',
  },
  {
    id: 'maclimit',
    label: __('Multi Device Login'),
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    defaultValue: '0',
    type: 'checkbox',
    required: true,
    // placeholder: __('Please Select ') + __('MAC Limit'),
  },
  {
    id: 'maclimitcount',
    label: __('Device limit'),
    type: 'number',
    min: '0',
    max: '999999',
    validator: validator({
      rules: 'num:[0,999999]',
    }),
    required: true,
    visible: $$data => $$data.get('maclimit') === '1',
  },
  {
    id: 'autologin',
    label: __('Auto Re-login'),
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    defaultValue: '0',
    type: 'checkbox',
    required: true,
  }, {
    id: 'speed',
    label: __('Speed Limit'),
    noForm: true,
    noTable: true,
    options: [
      {
        value: '1',
        label: __('1M'),
      },
    ],
    defaultValue: '0',
    type: 'select',
    required: true,
    placeholder: __('Please Select ') + __('Speed Limit'),
  },
  // {
  //   id: 'ex4',
  //   label: __('Last Unbind Month'),
  //   type: 'number',
  //   required: true,
  //   min: '1',
  //   max: '12',
  //   validator: validator({
  //     rules: 'num:[0,12]',
  //   }),
  // }, {
  //   id: 'ex3',
  //   label: __('Unbind Times'),
  //   type: 'number',
  //   min: '0',
  //   max: '999999',
  //   validator: validator({
  //     rules: 'num:[0,999999]',
  //   }),
  //   required: true,
  // },
]);

const advancedSetting = fromJS([
  {
    id: 'name',
    label: __('Name'),
    noTable: true,
    noForm: true,
    type: 'text',
    maxLength: '32',
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  },
  {
    id: 'gender',
    label: __('Gender'),
    noTable: true,
    options: [
      {
        value: '0',
        label: __('Male'),
      }, {
        value: '1',
        label: __('Female'),
      },
    ],
    defaultValue: '0',
    type: 'select',
    placeholder: __('Please Select ') + __('Gender'),

  },
  {
    id: 'idnumber',
    label: __('ID Document Number'),
    noTable: true,
    type: 'text',
    maxLength: '19',
    validator: validator({
      rules: 'utf8Len:[1,18]',
    }),
  },
  {
    id: 'phoneNumber',
    label: __('Phone'),
    noTable: true,
    type: 'text',
    maxLength: '18',
    validator: validator({
      rules: 'utf8Len:[1,18]',
    }),
    onChange: (data) => {
      const phoneNumber = data.value;
      const newNumber = phoneNumber.replace(/[^0-9-]/g, '');
      return Object.assign({}, data, { value: newNumber });
    },
  },
  {
    id: 'address',
    label: __('Address'),
    noTable: true,
    type: 'text',
    maxLength: '33',
    validator: validator({
      rules: 'utf8Len:[1,32]',
    }),
  },
  {
    id: 'email',
    label: __('Email'),
    noTable: true,
    type: 'text',
    maxLength: '32',
    validator: validator({
      rules: 'email',
    }),
  },
  {
    id: 'description',
    label: __('Details'),
    noTable: true,
    type: 'text',
    maxLength: '257',
    validator: validator({
      rules: 'utf8Len:[1,256]',
    }),
  },
  {
    id: 'ex1',
    label: __('Question'),
    noTable: true,
    type: 'select',
    maxLength: '129',
    options: [
      {
        value: '0',
        label: __("When is your father's birthday?"),
      }, {
        value: '1',
        label: __("What's your mother's name?"),
      },
      {
        value: '2',
        label: __('When did you graduate from primary school?'),
      }, {
        value: '3',
        label: __("What's your pet's name?"),
      }, {
        value: '4',
        label: __("What's your favorite sport?"),
      },
    ],
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  },
  {
    id: 'ex2',
    label: __('Answer'),
    noTable: true,
    type: 'text',
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  },
]);
const rechargeOptions = fromJS([
  {
    id: 'loginName',
    label: __('Username'),
    form: 'recharge',
    type: 'text',
    disabled: true,
    required: true,
    maxLength: '31',
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  },
  {
    id: 'nickname',
    label: __('Name'),
    type: 'text',
    form: 'recharge',
    disabled: true,
    noForm: true,
    maxLength: '33',
    validator: validator({
      rules: 'utf8Len:[1,32]',
    }),
  },
  {
    id: 'name',
    label: __('Recharge Choices'),
    form: 'recharge',
    required: true,
    type: 'select',
  },
  {
    id: 'state',
    label: __('Type'),
    form: 'recharge',
    type: 'select',
    disabled: true,
    required: true,
    options: [
      {
        value: '0',
        label: __('Hour Card'),
      }, {
        value: '1',
        label: __('Day Card'),
      },
      {
        value: '2',
        label: __('Month Card'),
      }, {
        value: '3',
        label: __('Year Card'),
      }, {
        value: '4',
        label: __('Traffic Card'),
      },
    ],
    visible(data) {
      return data.get('name') !== undefined;
    },
  },
  {
    id: 'maclimit',
    label: __('MAC Limit'),
    form: 'recharge',
    disabled: true,
    type: 'select',
    required: true,
    visible() {
      return false;
    },
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
  },
  {
    id: 'maclimitcount',
    label: __('MAC Quantity'),
    disabled: true,
    form: 'recharge',
    type: 'number',
    required: true,
    min: 0,
    visible() {
      return false;
    },
    validator: validator({
      rules: 'num:[0,9999]',
    }),
  },
  {
    id: 'autologin',
    label: __('Auto Re-login'),
    disabled: true,
    visible() {
      return false;
    },
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    type: 'select',
    required: true,
  },
  {
    id: 'speed',
    label: __('Speed Limit'),
    disabled: true,
    form: 'recharge',
    type: 'select',
    required: true,
    visible() {
      return false;
    },
    options: [
      {
        value: '1',
        label: __('1M'),
      },
    ],
  },
  {
    id: 'time',
    label: __('Count'),
    type: 'text',
    form: 'recharge',
    disabled: true,
    required: true,
    visible(data) {
      return data.get('name') !== undefined;
    },
    validator: validator({
      rules: 'num:[0,9999]',
    }),
  },
  {
    id: 'money',
    label: __('Price'),
    form: 'recharge',
    disabled: true,
    type: 'text',
    required: true,
    help: (val, $$data) => $$data.get('moneyUnit'),
    visible(data) {
      return data.get('name') !== undefined;
    },
  },
  {
    id: 'description',
    label: __('Description'),
    form: 'recharge',
    disabled: true,
    width: '120px',
    type: 'textarea',
    required: true,
    visible(data) {
      return data.get('name') !== undefined;
    },
  },
]);

// Component config
const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  validateAll: PropTypes.func,
  onListAction: PropTypes.func,
  updateCurListItem: PropTypes.func,
  reportValidError: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  changeScreenQuery: PropTypes.func,
  createModal: PropTypes.func,
};
const defaultProps = {};

export default class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBaseShow: true,
      isAdvancedShow: false,
      date: curDate.date,
    };

    utils.binds(this, [
      'renderCustomModal',
      'onAction',
      'onSave',
      'toggleBox',
      'getdefaultListItem',
      'onBeforeSave',
      'onBeforeSync',
    ]);
    this.state = {
      isBaseShow: true,
      $$cardDataList: fromJS([]),
    };
  }

  componentWillMount() {
    this.props.changeScreenQuery({ state: '-100' });

    utils.fetch('goform/portal/card/cardcategory', {
      size: 9999,
      page: 1,
    }).then((json) => {
      let $$cardDataList = fromJS([]);
      let categoryTypeOptions = fromJS([]);

      if (json.state && json.state.code === 2000) {
        $$cardDataList = fromJS(json.data.list);
        categoryTypeOptions = $$cardDataList.map(
          $$item => (fromJS({
            value: $$item.get('id'),
            label: $$item.get('name'),
            type: $$item.get('state'),
          })),
        );
      }

      this.setState({
        categoryTypeOptions,
        $$cardDataList,
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    const myScreenId = nextProps.store.get('curScreenId');
    const thisActionType = this.props.store.getIn([myScreenId, 'actionQuery', 'action']);
    const nextActionType = nextProps.store.getIn([myScreenId, 'actionQuery', 'action']);

    if (nextActionType === '' && thisActionType === 'recharge') {
      this.isCloseRechage = true;
    } else {
      this.isCloseRechage = false;
    }
  }

  onSave(formId) {
    if (this.props.validateAll) {
      this.props.validateAll(formId)
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            const store = this.props.store;
            const myScreenId = store.get('curScreenId');
            const $$myScreenStore = store.get(myScreenId);
            const $$curData = $$myScreenStore.get('curListItem');
            const $$actionQuery = $$myScreenStore.get('actionQuery');
            const str = this.onBeforeSync($$actionQuery, $$curData);
            if (str) {
              this.props.createModal({
                role: 'alert',
                customBackdrop: true,
                text: str,
              });
            } else {
              this.props.onListAction({
                needMerge: true,
              });
            }
          }
        });
    }
  }

  onBeforeSync($$actionQuery, $$curListItem) {
    const { store, route } = this.props;
    const actionType = $$actionQuery.get('action');
    const editIndex = $$actionQuery.get('index');
    // const loginName = $$curListItem.get('loginName');
    let $$curList = store.getIn([route.id, 'data', 'list']);
    let ret = '';
    if (actionType === 'add' || actionType === 'edit') {
      // 过滤正在编辑的项
      if (actionType === 'edit') {
        $$curList = $$curList.delete(editIndex);
      }

      // 检测是否有相同登录名
      if ($$curList.find($$item => $$curListItem.get('loginName') === $$item.get('loginName'))) {
        ret = __('User name exists already!');
      }
    }

    return ret;
  }
  toggleBox(moduleName) {
    this.setState({
      [moduleName]: !this.state[moduleName],
    });
  }
  renderCustomModal() {
    const { store, app, route } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curData = $$myScreenStore.get('curListItem');
    const userState = $$myScreenStore.getIn(['curListItem', 'userState']);
    const actionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    const isRecharge = store.getIn([route.id, 'actionQuery', 'action']) === 'recharge';
    const $$cardDataList = this.state.$$cardDataList;
    const $$cardDataItem = $$cardDataList.find($$item => $$item.get('id') === $$curData.get('name'));
    let $$rechargeDetailData = $$curData;
    let $$mybaseSetting = baseSetting;
    let $$myCategoryTypeOptions = this.state.categoryTypeOptions;
    let $$curRechargeOptions = null;


    if ($$cardDataItem) {
      $$rechargeDetailData = $$curData.merge($$cardDataItem.remove('name'));
    }

    // 充值
    if (isRecharge || this.isCloseRechage) {
      // 记时用户
      if (userState === '2') {
        $$myCategoryTypeOptions = $$myCategoryTypeOptions.filter(
          $$item => $$item && $$item.get('type') === '0',
        );

      // 买断用户
      } else if (userState === '3') {
        $$myCategoryTypeOptions = $$myCategoryTypeOptions.filter(
          $$item => '1,2,3,'.indexOf($$item.get('type')) !== -1,
        );

      // 流量用户
      } else if (userState === '4') {
        $$myCategoryTypeOptions = $$myCategoryTypeOptions.filter(
          $$item => $$item.get('type') === '4',
        );
      }
      $$curRechargeOptions = rechargeOptions.map(($$option) => {
        let $$ret = $$option;


        if ($$option.get('id') === 'name') {
          $$ret = $$ret.set('options', $$myCategoryTypeOptions);
          if ($$myCategoryTypeOptions.size < 1) {
            $$ret = $$ret.set('help', __('Please create the corresponding recharge voucher first'));
          }
        }

        return $$ret;
      });
      return (
        <FormContainer
          id="recharge"
          options={$$curRechargeOptions}
          data={$$rechargeDetailData}
          onChangeData={this.props.updateCurListItem}
          onSave={() => this.onSave('recharge')}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          isSaving={app.get('saving')}
          savedText="success"
          hasSaveButton
        />
      );
    }


    if (actionType === 'edit') {
      $$mybaseSetting = $$mybaseSetting.map(
        ($$item) => {
          let $$ret = $$item;
          if ($$ret.get('notEditable')) {
            $$ret = $$ret.set('disabled', true);
          }
          return $$ret;
        },
      );
    }

    return (
      <div className="o-box row">
        <div
          className="o-box__cell"
          onClick={() => this.toggleBox('isBaseShow')}
        >
          <h3 style={{ cursor: 'pointer' }}>
            <Icon
              name={this.state.isBaseShow ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
            />
            {__('General Settings')}
          </h3>
        </div>
        {
          this.state.isBaseShow ? (
            <div className="o-box__cell">
              <FormContainer
                id="baseSetting"
                options={$$mybaseSetting}
                data={$$curData}
                onChangeData={this.props.updateCurListItem}
                onSave={() => this.onSave('baseSetting')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
                isSaving={app.get('saving')}
                hasSaveButton
              />
            </div>
          ) : null
        }
        <div
          className="o-box__cell"
          onClick={() => this.toggleBox('isAdvancedShow')}
        >
          <h3 style={{ cursor: 'pointer' }}>
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
                id="advancedSetting"
                options={advancedSetting}
                data={$$curData}
                onChangeData={this.props.updateCurListItem}
                onSave={() => this.onSave('advancedSetting')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
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
    const curListOptions = listOptions
      .setIn([-1, 'render'], (val, $$data) => {
        const userState = $$data.get('state');

        // 0免费用户不能充值，1停用的用户也不能充值
        if (parseInt(userState, 10) <= 1) {
          return null;
        }

        return (
          <span>
            <Button
              text={__('Recharge')}
              key="rechargeActionButton"
              icon="vcard"
              onClick={() => {
                this.props.changeScreenActionQuery({
                  action: 'recharge',
                  myTitle: __('Recharge'),
                });
                this.props.updateCurListItem({
                  id: $$data.get('id'),
                  loginName: $$data.get('loginName'),
                  nickname: $$data.get('name'),
                  userState: $$data.get('state'),
                });
              }}
            />
          </span>
        );
      });
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        modalChildren={this.renderCustomModal()}
        queryFormOptions={queryFormOptions}
        searchable
        searchProps={{
          placeholder: `${__('Username')}`,
        }}
        selectable={$$data => parseInt($$data.get('id'), 10) !== 1}
        deleteable={$$data => parseInt($$data.get('id'), 10) !== 1}
        editable={$$data => parseInt($$data.get('id'), 10) !== 1}
        actionable
      />
    );
  }
}

AccountList.propTypes = propTypes;
AccountList.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
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
)(AccountList);
