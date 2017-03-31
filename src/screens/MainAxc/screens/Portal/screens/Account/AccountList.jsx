import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import FormContainer from 'shared/components/Organism/FormContainer';
import Icon from 'shared/components/Icon';
// custom
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';
import { Button } from 'shared/components/Button';

function getCardCategoryName() {
  return utils.fetch('goform/portal/card/cardcategory', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.name,
          }),
        ),
      }
    ),
  );
}
function getCardInformation() {
  return utils.fetch('goform/portal/card/cardcategory', {
    size: 9999,
    page: 1,
  }).then((json) => {
    if (json.state && json.state.code === 2000) {
      return fromJS(json.data.list);
    }
    return fromJS([]);
  });
}

const uptimeFilter = utils.filter('connectTime');

const queryFormOptions = fromJS([
  {
    id: 'state',
    type: 'select',
    label: __('Acc Type'),
    options: [
      {
        value: '0',
        label: __('Unavailability'),
      }, {
        value: '1',
        label: __('Free of Charge'),
      },
      {
        value: '2',
        label: __('Timekeeping'),
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
    text: __('Login Name'),
  }, {
    id: 'date',
    text: __('Expired Date'),
    noForm: true,
  }, {
    id: 'time',
    text: __('Left Time'),
    noForm: true,
    transform(val) {
      return uptimeFilter.transform(val / 1000);
    },
  }, {
    id: 'octets',
    text: __('Left Traffic'),
    noForm: true,
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
    text: __('Type'),
    options: [
      {
        value: '0',
        label: __('Unavailability'),
      }, {
        value: '1',
        label: __('Free of Charge'),
      },
      {
        value: '2',
        label: __('Timekeeping'),
      }, {
        value: '3',
        label: __('Buy Out'),
      }, {
        value: '4',
        label: __('Traffic'),
      },
    ],
    defaultValue: '0',
  }, {
    id: 'maclimit',
    text: __('Mac Limit'),
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
  }, {
    id: 'maclimitcount',
    text: __('Mac Quantity'),
  }, {
    id: 'autologin',
    text: __('Auto Login'),
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
  }, {
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
  }, {
    id: 'ex4',
    text: __('Last Unbind Month'),
    noForm: true,
    noTable: true,
  }, {
    id: 'ex3',
    text: __('Unbind Times'),
    noForm: true,
    noTable: true,
  }, {
    id: 'name',
    text: __('Name'),
    noTable: true,
  }, {
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
  }, {
    id: 'idnumber',
    text: __('ID No.'),
    noTable: true,
  }, {
    id: 'phoneNumber',
    text: __('Phone'),
    noTable: true,
  }, {
    id: 'address',
    text: __('Address'),
    noTable: true,
  }, {
    id: 'email',
    text: __('Email'),
    noTable: true,
  }, {
    id: 'description',
    text: __('Detail Information'),
    noTable: true,
  }, {
    id: 'ex5',
    text: __('ex5'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex6',
    text: __('ex6'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex7',
    text: __('ex7'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex8',
    text: __('ex8'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex9',
    text: __('ex9'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex10',
    text: __('ex10'),
    noTable: true,
    noForm: true,
  }, {
    id: '__actions__',
    text: __('Actions'),
    transform(val, $$item) {
      return (
        <span>
          <a href={`/index.html#/main/portal/account/list/mac/${$$item.get('loginName')}`} className="tablelink">{__('Mac Management')}</a>
        </span>
      );
    },
  },
]);
export const baseSetting = fromJS([
  {
    id: 'loginName',
    label: __('Login Name'),
    className: 'cols col-6',
    type: 'text',
    required: true,
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  }, {
    id: 'password',
    label: __('Password'),
    className: 'cols col-6',
    type: 'password',
    noTable: true,
    required: true,
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  }, {
    id: 'ex1',
    label: __('Question'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  }, {
    id: 'ex2',
    label: __('Answer'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  }, {
    id: 'state',
    label: __('Type'),
    className: 'cols col-12',
    options: [
      {
        value: '0',
        label: __('Unavailability'),
      }, {
        value: '1',
        label: __('Free of Charge'),
      },
      {
        value: '2',
        label: __('Timekeeping'),
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

  }, {
    id: 'maclimit',
    label: __('Mac Limit'),
    className: 'cols col-6',
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
    type: 'select',
    required: true,
    placeholder: __('Please Select ') + __('Mac Limit'),
  }, {
    id: 'maclimitcount',
    label: __('Mac Quantity'),
    className: 'cols col-6',
    type: 'number',
    min: '0',
    max: '999999',
    validator: validator({
      rules: 'num:[0,999999]',
    }),
    required: true,
  }, {
    id: 'autologin',
    label: __('Auto Login'),
    className: 'cols col-6',
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
    type: 'select',
    required: true,
    placeholder: __('Auto Login') + __('Auto Login'),

  }, {
    id: 'speed',
    label: __('Speed Limit'),
    noForm: true,
    noTable: true,
    className: 'cols col-6',
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
  }, {
    id: 'ex4',
    label: __('Last Unbind Month'),
    className: 'cols col-6',
    type: 'number',
    required: true,
    min: '1',
    max: '12',
    validator: validator({
      rules: 'num:[0,12]',
    }),
  }, {
    id: 'ex3',
    label: __('Unbind Times'),
    className: 'cols col-6',
    type: 'number',
    min: '0',
    max: '999999',
    validator: validator({
      rules: 'num:[0,999999]',
    }),
    required: true,
  },
]);

export const advancedSetting = fromJS([
  {
    id: 'name',
    label: __('Name'),
    noTable: true,
    className: 'cols col-12',
    type: 'text',
    maxLength: '32',
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  }, {
    id: 'gender',
    label: __('Gender'),
    className: 'cols col-6',
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

  }, {
    id: 'idnumber',
    label: __('ID No.'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
    maxLength: '19',
    validator: validator({
      rules: 'utf8Len:[1,18]',
    }),
  }, {
    id: 'phoneNumber',
    label: __('Phone'),
    noTable: true,
    className: 'cols col-6',
    type: 'text',
    maxLength: '19',
    validator: validator({
      rules: 'utf8Len:[1,18]',
    }),
  }, {
    id: 'address',
    label: __('Address'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
    maxLength: '33',
    validator: validator({
      rules: 'utf8Len:[1,32]',
    }),
  }, {
    id: 'email',
    label: __('Email'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
    maxLength: '32',
    validator: validator({
      rules: 'email',
    }),
  }, {
    id: 'description',
    label: __('Detail Information'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
    maxLength: '257',
    validator: validator({
      rules: 'utf8Len:[1,256]',
    }),
  },
]);
const rechargeOptions = fromJS([
  {
    id: 'loginName',
    label: __('Login Name'),
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
    required: true,
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
  }, {
    id: 'maclimit',
    label: __('Mac Limit'),
    form: 'recharge',
    disabled: true,
    type: 'select',
    required: true,
    visible(data) {
      return data.get('name') !== undefined;
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
  }, {
    id: 'maclimitcount',
    label: __('Mac Quantity'),
    disabled: true,
    form: 'recharge',
    type: 'number',
    required: true,
    min: 0,
    visible(data) {
      return data.get('name') !== undefined;
    },
    validator: validator({
      rules: 'num:[0,9999]',
    }),
  }, {
    id: 'autologin',
    label: __('Auto Login'),
    disabled: true,
    visible(data) {
      return data.get('name') !== undefined;
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
  }, {
    id: 'speed',
    label: __('Speed Limit'),
    disabled: true,
    form: 'recharge',
    type: 'select',
    required: true,
    visible(data) {
      return data.get('name') !== undefined;
    },
    options: [
      {
        value: '1',
        label: __('1M'),
      },
    ],
  }, {
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
  }, {
    id: 'money',
    label: __('Price'),
    form: 'recharge',
    disabled: true,
    type: 'text',
    required: true,
    help: __('$'),
    visible(data) {
      return data.get('name') !== undefined;
    },
  }, {
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

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  validateAll: PropTypes.func,
  onListAction: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  reportValidError: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBaseShow: true,
      isAdvancedShow: false,
    };

    utils.binds(this, [
      'renderCustomModal',
      'onAction',
      'onSave',
      'toggleBox',
      'getDefaultEditData',
      'onBeforeSave',
    ]);
    this.state = {
      $$cardDataList: fromJS([]),
    };
  }

  componentWillMount() {
    getCardCategoryName()
      .then((data) => {
        this.setState({
          categoryTypeOptions: fromJS(data.options),
        });
      });
    getCardInformation()
      .then(($$data) => {
        this.setState({
          $$cardDataList: $$data,
        });
      });
    // this.getDefaultEditData();
  }
  // onBeforeSave() {
  //   const { store } = this.props;
  //   const myScreenId = store.get('curScreenId');
  //   const $$myScreenStore = store.get(myScreenId);
  //   const $$curData = $$myScreenStore.get('curListItem');
  // }
  onSave(formId) {
    if (this.props.validateAll) {
      this.props.validateAll(formId)
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            this.props.onListAction({
              needMerge: true,
            });
          }
        });
    }
  }
  // getDefaultEditData() {
  //   const myDefaultEditData = {};
  //   baseSetting.forEach(
  //     ($$item, index) => {
  //       const curId = $$item.get('id');
  //       const defaultValue = $$item.get('defaultValue') || '';

  //       myDefaultEditData[curId] = defaultValue;

  //       return index;
  //     },
  //   );
  //   advancedSetting.forEach(
  //     ($$item, index) => {
  //       const curId = $$item.get('id');
  //       const defaultValue = $$item.get('defaultValue') || '';
  //       myDefaultEditData[curId] = defaultValue;
  //       return index;
  //     },
  //   );

  //   this.defaultEditData = myDefaultEditData;
  // }
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
    const actionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    const isRecharge = store.getIn([route.id, 'actionQuery', 'action']) === 'recharge';
    const $$curRechargeOptions = rechargeOptions.setIn([2, 'options'], this.state.categoryTypeOptions);
    const $$cardDataList = this.state.$$cardDataList;
    const $$cardDataItem = $$cardDataList.find($$item => $$item.get('id') === $$curData.get('name'));
    let $$rechargeDetailData = $$curData;
    let $$mybaseSetting = baseSetting;

    if ($$cardDataItem) {
      $$rechargeDetailData = $$curData.merge($$cardDataItem.delete('name'));
    }

    if (actionType !== 'add' && actionType !== 'edit' && !isRecharge) {
      return null;
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

    if (isRecharge) {
      return (
        <FormContainer
          id="recharge"
          options={$$curRechargeOptions}
          data={$$rechargeDetailData}
          onChangeData={this.props.updateCurEditListItem}
          onSave={() => this.onSave('recharge')}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          isSaving={app.get('saving')}
          savedText="success"
          hasSaveButton
        />
      );
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
                id="baseSetting"
                className="o-form--compassed"
                options={$$mybaseSetting}
                data={$$curData}
                onChangeData={this.props.updateCurEditListItem}
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
                id="advancedSetting"
                options={advancedSetting}
                className="o-form--compassed"
                data={$$curData}
                onChangeData={this.props.updateCurEditListItem}
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
          .setIn([-1, 'transform'], (val, $$data) => (
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
                  this.props.updateCurEditListItem({
                    id: $$data.get('id'),
                    loginName: $$data.get('loginName'),
                    nickname: $$data.get('name'),
                  });
                }}
              />
            </span>
          ),
          );
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        modalChildren={this.renderCustomModal()}
        selectable
        actionable
        queryFormOptions={queryFormOptions}
        searchable
        searchProps={{
          placeholder: `${__('Login Name')}`,
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
