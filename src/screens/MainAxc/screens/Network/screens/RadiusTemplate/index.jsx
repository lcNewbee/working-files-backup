import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';

import validator from 'shared/validator';
import FormContainer from 'shared/components/Organism/FormContainer';
import Icon from 'shared/components/Icon';
// custom
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';
// import * as appActions from 'shared/actions/app';
// import * as screenActions from 'shared/actions/screens';
// // import * as propertiesActions from 'shared/actions/properties';
// import './index.scss';

function getNasIP() {
  return utils.fetch('goform/portal/radius/nas', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.ip,
            label: item.ip,
            item,
          }),
        ),
      }
    ),
  );
}


const serverChoices = fromJS([
  {
    id: 'serverType',
    label: __('Server Type'),
    className: 'cols col-4',
    defaultValue: 'remote',
    display: 'block',
    options: [
      {
        value: 'remote',
        label: __('Remote Server'),
      }, {
        value: 'local',
        label: __('Local Server'),
      },
    ],
    type: 'switch',
  },
]);
const authServer = fromJS([
  {
    id: 'template_name',
    label: __('Name'),
    form: 'authServer',
    type: 'text',
    maxLength: '31',
    required: true,
    className: 'cols col-12',
    notEditable: true,
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  }, {
    id: 'nasip',
    label: __('Nas IP'),
    form: 'authServer',
    type: 'text',
    required: true,
    className: 'cols col-12',
    validator: validator({
      rules: 'ip',
    }),
    visible(data) {
      return data.get('serverType') === 'remote';
    },
  }, {
    id: 'nasip',
    label: __('Nas IP'),
    form: 'authServer',
    type: 'select',
    required: true,
    className: 'cols col-12',
    validator: validator({
      rules: 'ip',
    }),
    visible(data) {
      return data.get('serverType') === 'local';
    },
    onChange: (data) => {
      const item = data.item;
      const retData = data;
      retData.mergeData = {
        authpri_ipaddr: item.ip,
        authpri_port: '1812',
        authpri_key: item.sharedSecret,
        authsecond_ipaddr: item.ip,
        authsecond_port: '1812',
        authsecond_key: item.sharedSecret,
        acctpri_ipaddr: item.ip,
        acctpri_port: '1813',
        acctpri_key: item.sharedSecret,
        acctsecond_ipaddr: item.ip,
        acctsecond_port: '1813',
        acctsecond_key: item.sharedSecret,
      };
      return retData;
    },
  }, {
    id: 'authpri_ipaddr',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    fieldset: 'auth',
    fieldsetOption: {
      legend: __('Primary Auth Server'),
      className: 'cols col-6',
    },
    form: 'authServer',
    label: __('IP Address'),
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'authpri_port',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Port'),
    fieldset: 'auth',
    form: 'authServer',
    required: true,
    defaultValue: '1812',
    type: 'number',
    min: '1',
    max: '65535',
  }, {
    id: 'authpri_key',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Password'),
    fieldset: 'auth',
    form: 'authServer',
    type: 'password',
    required: true,
    maxLength: '31',
    validator: validator({
      rules: 'pwd',
    }),
  }, {
    id: 'authsecond_ipaddr',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('IP Address'),
    fieldset: 'auth_secondary',
    fieldsetOption: {
      legend: __('Secondary Auth Server'),
      className: 'cols col-6',
    },
    type: 'text',
    form: 'authServer',
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'authsecond_port',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Port'),
    fieldset: 'auth_secondary',
    type: 'number',
    form: 'authServer',
    min: '1',
    max: '65535',
  }, {
    id: 'authsecond_key',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Password'),
    fieldset: 'auth_secondary',
    type: 'password',
    form: 'authServer',
    maxLength: '31',
    validator: validator({
      rules: 'pwd',
    }),
  },
]);

const accServer = fromJS([
  {
    id: 'acctpri_ipaddr',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('IP Address'),
    fieldset: 'primary',
    fieldsetOption: {
      legend: __('Primary Accounting Server'),
      className: 'cols col-6',
    },
    required: true,
    type: 'text',
    form: 'accServer',
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'acctpri_port',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Port'),
    fieldset: 'primary',
    required: true,
    defaultValue: '1813',
    type: 'number',
    form: 'accServer',
    min: '1',
    max: '65535',
  }, {
    id: 'acctpri_key',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    required: true,
    label: __('Password'),
    fieldset: 'primary',
    form: 'accServer',
    type: 'password',
    maxLength: '31',
    validator: validator({
      rules: 'pwd',
    }),
  }, {
    id: 'acctsecond_ipaddr',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('IP Address'),
    fieldsetOption: {
      legend: __('Secondary Accounting Server'),
      className: 'cols col-6',
    },
    fieldset: 'secondary',
    type: 'text',
    form: 'accServer',
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'acctsecond_port',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Port'),
    fieldset: 'secondary',
    type: 'number',
    form: 'accServer',
    min: '1',
    max: '65535',
  }, {
    id: 'acctsecond_key',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Password'),
    fieldset: 'secondary',
    form: 'accServer',
    type: 'password',
    maxLength: '31',
    validator: validator({
      rules: 'pwd',
    }),
  },
]);

const advancedSetting = fromJS([
  {
    id: 'username_format',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('User Format'),
    fieldset: 'parameter',
    defaultValue: 'UNCHANGE',
    noTable: true,
    type: 'select',
    required: true,
    placeholder: __('Please Select ') + __('User Format'),
    options: [
      {
        value: 'UNCHANGE',
        label: 'KEEP_ORIGINAL',
      }, {
        value: 'WITH',
        label: 'WITH_DOMAN',
      }, {
        value: 'WITHOUT',
        label: 'WITHOUT_DOMAIN',
      },
    ],
  }, {
    id: 'quiet_time',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Silent Time'),
    fieldset: 'parameter',
    defaultValue: '300',
    min: '60',
    max: '7200',
    noTable: true,
    type: 'number',
    required: true,
    help: __('Seconds'),
  }, {
    id: 'retry_times',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Max Messaging Times'),
    fieldset: 'parameter',
    type: 'number',
    defaultValue: '3',
    min: '1',
    max: '10',
    required: true,
  }, {
    id: 'resp_time',
    label: __('Response Timeout Time'),
    fieldset: 'parameter',
    type: 'number',
    defaultValue: '3',
    min: '1',
    max: '30',
    required: true,
    help: __('Seconds'),
  },
  {
    id: 'accton_enable',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting-on'),
    defaultValue: '0',
    value: '1',
    fieldset: 'parameter',
    required: true,
    noTable: true,
    noForm: true,
    type: 'checkbox',
    text: __('Enable'),
  }, {
    id: 'accton_sendtimes',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting-on Resend Times'),
    fieldset: 'acctonAdvance',
    type: 'number',
    defaultValue: '3',
    min: '1',
    max: '10',
    required: true,
    noForm: true,
    noTable: true,
    visible(data) {
      return data.get('accton_enable') === '1';
    },
  }, {
    id: 'accton_sendinterval',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting-on Resend Interval'),
    fieldset: 'acctonAdvance',
    noTable: true,
    noForm: true,
    type: 'number',
    required: true,
    help: __('Seconds'),
    defaultValue: '3',
    min: '1',
    max: '30',
    visible(data) {
      return data.get('accton_enable') === '1';
    },
  },
  {
    id: 'acct_interim_interval',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting Messaging Interval'),
    fieldset: 'acctonAdvance',
    noTable: true,
    required: true,
    type: 'number',
    help: __('Seconds'),
    defaultValue: '720',
    min: '300',
    max: '3600',
  }, {
    id: 'realretrytimes',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting Message-Resend Times'),
    fieldset: 'acctonAdvance',
    type: 'number',
    required: true,
    defaultValue: '5',
    min: '1',
    max: '10',
  },
]);

// 列表相关配置
const listOptions = fromJS([
  {
    id: 'template_name',
    label: __('Name'),
    type: 'text',
    required: true,
    notEditable: true,
    defaultValue: '',
  },
  {
    id: 'nasip',
    label: __('Nas IP'),
    required: true,
  },
  {
    id: 'authpri_ipaddr',
    label: __('Auth Server IP'),
    fieldset: 'auth',
  }, {
    id: 'authpri_port',
    label: __('Auth Server Port'),
    fieldset: 'auth',
    defaultValue: '1812',
  }, {
    id: 'acctpri_ipaddr',
    label: __('Accounting Server IP'),
    fieldset: 'Accounting',
  }, {
    id: 'acctpri_port',
    label: __('Accounting Server Port'),
    fieldset: 'Accounting',
    defaultValue: '',
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  validateAll: PropTypes.func,
  onListAction: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  reportValidError: PropTypes.func,
  createModal: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nasIPOptions: fromJS([]),
      pwdOptions: fromJS([]),
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
      // 'onChange',
    ]);
  }

  componentWillMount() {
    this.getDefaultEditData();
    getNasIP()
      .then((data) => {
        this.setState({
          nasIPOptions: fromJS(data.options),
        });
      });
  }
  onBeforeSave() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curData = $$myScreenStore.get('curListItem');

    if (!$$curData.get('acctpri_ipaddr') || !$$curData.get('acctpri_key')) {
      this.props.updateCurEditListItem({
        acctpri_ipaddr: $$curData.get('authpri_ipaddr'),
        acctpri_key: $$curData.get('authpri_key'),
      });
    }
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
    authServer.forEach(
      ($$item, index) => {
        const curId = $$item.get('id');
        const defaultValue = $$item.get('defaultValue') || '';

        myDefaultEditData[curId] = defaultValue;

        return index;
      },
    );
    serverChoices.forEach(
      ($$item, index) => {
        const curId = $$item.get('id');
        const defaultValue = $$item.get('defaultValue') || '';

        myDefaultEditData[curId] = defaultValue;

        return index;
      },
    );
    accServer.forEach(
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
    const curAuthServer = authServer.setIn([2, 'options'], this.state.nasIPOptions);
    let $$myAuthServer = curAuthServer;
    if (actionType !== 'add' && actionType !== 'edit') {
      return null;
    }
    if (actionType === 'edit') {
      $$myAuthServer = $$myAuthServer.map(
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
          <FormContainer
            id="serverChoice"
            className="o-form--compassed"
            options={serverChoices}
            data={$$curData}
            onChangeData={(data) => {
              if (data.serverType === 'local' && this.state.nasIPOptions.size < 1) {
                this.props.createModal({
                  type: 'alert',
                  text: __(
                    'No data, please go to the %s-->%s page to add nas data!',
                    __('Hotspot'),
                    __('Radius Server'),
                  ),
                });
              } else {
                this.props.updateCurEditListItem(data);
              }
            }}
            onSave={() => this.onSave('serverChoices')}
            invalidMsg={app.get('invalid')}
            validateAt={app.get('validateAt')}
            onValidError={this.props.reportValidError}
            isSaving={app.get('saving')}
          />
        </div>
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
                id="authServer"
                className="o-form--compassed"
                options={$$myAuthServer}
                data={$$curData}
                onChangeData={this.props.updateCurEditListItem}
                onSave={() => this.onSave('authServer')}
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
            onClick={() => this.toggleBox('isAccountingShow')}
          >
            <Icon
              name={this.state.isAccountingShow ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
              onClick={() => this.toggleBox('isAccountingShow')}
            />
            {__('Accounting Server Settings')}
          </h3>
        </div>
        {
          this.state.isAccountingShow ? (
            <div className="o-box__cell">
              <FormContainer
                id="accServer"
                options={accServer}
                className="o-form--compassed"
                data={$$curData}
                onChangeData={this.props.updateCurEditListItem}
                onSave={() => this.onSave('accServer')}
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
        initOption={{
          defaultEditData: this.defaultEditData,
        }}
        modalChildren={this.renderCustomModal()}
        listKey="template_name"
        maxListSize="16"
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
