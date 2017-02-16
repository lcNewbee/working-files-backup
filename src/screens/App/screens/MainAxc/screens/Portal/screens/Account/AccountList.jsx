import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import validator from 'shared/validator';
import { baseSetting, advancedSetting } from 'shared/config/axcPortalAccount';
import AppScreen from 'shared/components/Template/AppScreen';
import FormContainer from 'shared/components/Organism/FormContainer';
import Icon from 'shared/components/Icon';
// custom
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

// 列表相关配置
const listOptions = fromJS([
  {
    id: 'loginName',
    text: _('Login Name'),
    formProps: {
      type: 'text',
      required: true,
      maxLength: '31',
    },
  }, {
    id: 'date',
    text: _('Expired Date'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'time',
    text: _('Left Time'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'octets',
    text: _('Left Traffic'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'password',
    text: _('Password'),
    type: 'pwd',
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'ex1',
    text: _('Question'),
    noTable: true,
    formProps: {
      type: 'text',
    },
  }, {
    id: 'ex2',
    text: _('Answer'),
    noTable: true,
    type: 'text',
  }, {
    id: 'state',
    type: 'text',
    text: _('Type'),
    options: [
      {
        value: '0',
        label: _('Unavailability'),
      }, {
        value: '1',
        label: _('Free'),
      },
      {
        value: '2',
        label: _('Timekeeping'),
      }, {
        value: '3',
        label: _('Buy Out'),
      }, {
        value: '4',
        label: _('Traffic'),
      }, {
        value: '-1',
        label: _('Outside User'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Type'),
      placeholder: _('Please Select ') + _('Type'),
    },
  }, {
    id: 'maclimit',
    text: _('Mac Limit'),
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Mac Limit'),
      placeholder: _('Please Select ') + _('Mac Limit'),
    },
  }, {
    id: 'maclimitcount',
    text: _('Mac Quantity'),
    formProps: {
      type: 'num',
      min: '0',
      required: true,
    },
  }, {
    id: 'autologin',
    text: _('Auto Login'),
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Auto Login'),
      placeholder: _('Auto Login') + _('Auto Login'),
    },
  }, {
    id: 'speed',
    text: _('Speed Limit'),
    options: [
      {
        value: '0',
        label: _('1M'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Speed Limit'),
      placeholder: _('Please Select ') + _('Speed Limit'),
    },
  }, {
    id: 'ex4',
    text: _('Last Unbind Month'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ex3',
    text: _('Unbind Times'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'num',
      min: '0',
      required: true,
    },
  }, {
    id: 'name',
    text: _('Name'),
    noTable: true,
    formProps: {
      type: 'text',
      maxLength: '31',
    },
  }, {
    id: 'gender',
    text: _('Gender'),
    noTable: true,
    options: [
      {
        value: '0',
        label: _('Male'),
      }, {
        value: '1',
        label: _('Female'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      label: _('Gender'),
      placeholder: _('Please Select ') + _('Gender'),
    },
  }, {
    id: 'idnumber',
    text: _('ID No.'),
    noTable: true,
    formProps: {
      type: 'num',
    },
  }, {
    id: 'phoneNumber',
    text: _('Phone'),
    noTable: true,
    formProps: {
      type: 'num',
    },
  }, {
    id: 'address',
    text: _('Address'),
    noTable: true,
    formProps: {
      type: 'text',
    },
  }, {
    id: 'email',
    text: _('Email'),
    noTable: true,
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'email',
      }),
    },
  }, {
    id: 'description',
    text: _('Detail Information'),
    noTable: true,
    formProps: {
      type: 'text',
    },
  }, {
    id: 'ex5',
    text: _('ex5'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex6',
    text: _('ex6'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex7',
    text: _('ex7'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex8',
    text: _('ex8'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex9',
    text: _('ex9'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex10',
    text: _('ex10'),
    noTable: true,
    noForm: true,
  }, {
    id: '__actions__',
    text: _('Actions'),
    actions: [
      {
        icon: 'check-square-o',
        actionName: 'reset',
        text: _('Reset Password'),
      },
    ],
    transform(val, $$item) {
      return (
        <span>
          <a href={`/index.html#/main/portal/account/accountListMac/${$$item.get('loginName')}`} className="tablelink">{_('Mac Management')}</a>
        </span>
      );
    },
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  validateAll: PropTypes.func,
  onListAction: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  reportValidError: PropTypes.func,
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
  }

  componentWillMount() {
    this.getDefaultEditData();
  }
  onBeforeSave() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curData = $$myScreenStore.get('curListItem');
  }
  onSave(formId) {
    if (this.props.validateAll) {
      this.props.validateAll(formId)
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            this.onBeforeSave();
            this.props.onListAction();
          }
        });
    }
  }
  getDefaultEditData() {
    const myDefaultEditData = {};
    baseSetting.forEach(
      ($$item, index) => {
        const curId = $$item.get('id');
        const defaultValue = $$item.get('defaultValue') || '';

        myDefaultEditData[curId] = defaultValue;

        return index;
      },
    );
    advancedSetting.forEach(
      ($$item, index) => {
        const curId = $$item.get('id');
        const defaultValue = $$item.get('defaultValue') || '';
        myDefaultEditData[curId] = defaultValue;
        return index;
      },
    );

    this.defaultEditData = myDefaultEditData;
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
    const $$curData = $$myScreenStore.get('curListItem');
    const actionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    let $$mybaseSetting = baseSetting;

    if (actionType !== 'add' && actionType !== 'edit') {
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
            {_('Advanced Settings')}
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
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        defaultEditData={this.defaultEditData}
        modalChildren={this.renderCustomModal()}
        selectable
        actionable
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
