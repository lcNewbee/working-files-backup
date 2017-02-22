import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';
import validator from 'shared/validator';
import FormContainer from 'shared/components/Organism/FormContainer';
import Icon from 'shared/components/Icon';
// custom
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

const authServer = fromJS([
  {
    id: 'template_name',
    label: _('Name'),
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
    label: _('Nas IP'),
    form: 'authServer',
    type: 'text',
    required: true,
    className: 'cols col-12',
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'authpri_ipaddr',
    fieldset: 'auth',
    fieldsetOption: {
      legend: _('Primary Auth Server'),
      className: 'cols col-6',
    },
    form: 'authServer',
    label: _('IP Address'),
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'authpri_port',
    label: _('Port'),
    fieldset: 'auth',
    form: 'authServer',
    required: true,
    defaultValue: '1812',
    type: 'number',
    min: 1,
    max: 65535,
  }, {
    id: 'authpri_key',
    label: _('Password'),
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
    label: _('IP Address'),
    fieldset: 'auth_secondary',
    fieldsetOption: {
      legend: _('Secondary Auth Server'),
      className: 'cols col-6',
    },
    type: 'text',
    form: 'authServer',
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'authsecond_port',
    label: _('Port'),
    fieldset: 'auth_secondary',
    type: 'number',
    form: 'authServer',
    min: 1,
    max: 65535,
  }, {
    id: 'authsecond_key',
    label: _('Password'),
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
    label: _('IP Address'),
    fieldset: 'primary',
    fieldsetOption: {
      legend: _('Primary Accounting Server'),
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
    label: _('Port'),
    fieldset: 'primary',
    required: true,
    defaultValue: '1813',
    type: 'number',
    form: 'accServer',
    min: 1,
    max: 65535,
  }, {
    id: 'acctpri_key',
    required: true,
    label: _('Password'),
    fieldset: 'primary',
    form: 'accServer',
    type: 'password',
    maxLength: '31',
    validator: validator({
      rules: 'pwd',
    }),
  }, {
    id: 'acctsecond_ipaddr',
    label: _('IP Address'),
    fieldsetOption: {
      legend: _('Secondary Accounting Server'),
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
    label: _('Port'),
    fieldset: 'secondary',
    type: 'number',
    form: 'accServer',
    min: 1,
    max: 65535,
  }, {
    id: 'acctsecond_key',
    label: _('Password'),
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
    label: _('User Format'),
    fieldset: 'parameter',
    defaultValue: 'WITH',
    noTable: true,
    type: 'select',
    required: true,
    placeholder: _('Please Select ') + _('User Format'),
    options: [
      {
        value: 'WITHOUT',
        label: 'WITHOUT_DOMAIN',
      }, {
        value: 'WITH',
        label: 'WITH_DOMAN',
      }, {
        value: 'UNCHANGE',
        label: 'KEEP_ORIGINAL',
      },
    ],
  }, {
    id: 'quiet_time',
    label: _('Silent Time'),
    fieldset: 'parameter',
    defaultValue: '300',
    min: 60,
    max: 7200,
    noTable: true,
    type: 'number',
    required: true,
    help: _('Seconds'),
  }, {
    id: 'retry_times',
    label: _('Max Messaging Times'),
    fieldset: 'parameter',
    type: 'number',
    defaultValue: '3',
    min: 3,
    max: 10,
    required: true,
  }, {
    id: 'resp_time',
    label: _('Response Timeout Time'),
    fieldset: 'parameter',
    type: 'number',
    defaultValue: '3',
    min: 3,
    max: 30,
    required: true,
    help: _('Seconds'),
  }, {
    id: 'accton_enable',
    label: _('Accounting-on'),
    defaultValue: '0',
    value: '1',
    fieldset: 'parameter',
    required: true,
    noTable: true,
    type: 'checkbox',
    text: _('Enable'),
  }, {
    id: 'accton_sendtimes',
    label: _('Accounting-on Resend Times'),
    fieldset: 'acctonAdvance',
    type: 'number',
    defaultValue: '3',
    min: 3,
    max: 10,
    required: true,
    showPrecondition(data) {
      return data.get('accton_enable') === '1';
    },
  }, {
    id: 'accton_sendinterval',
    label: _('Accounting-on Resend Interval'),
    fieldset: 'acctonAdvance',
    noTable: true,
    type: 'number',
    required: true,
    help: _('Seconds'),
    defaultValue: '3',
    min: 3,
    max: 30,
    showPrecondition(data) {
      return data.get('accton_enable') === '1';
    },
  }, {
    id: 'acct_interim_interval',
    label: _('Accounting Messaging Interval'),
    fieldset: 'acctonAdvance',
    noTable: true,
    required: true,
    type: 'number',
    help: _('Seconds'),
    defaultValue: '720',
    min: 300,
    max: 3600,
  }, {
    id: 'realretrytimes',
    label: _('Accounting Message-Resend Times'),
    fieldset: 'acctonAdvance',
    type: 'number',
    required: true,
    defaultValue: '5',
    min: 3,
    max: 10,
  },
]);

// 列表相关配置
const listOptions = fromJS([
  {
    id: 'template_name',
    label: _('Name'),
    type: 'text',
    required: true,
    notEditable: true,
    defaultValue: '',
  },
  {
    id: 'nasip',
    label: _('Nas IP'),
    required: true,
  },
  {
    id: 'authpri_ipaddr',
    label: _('Auth Server IP'),
    fieldset: 'auth',
  }, {
    id: 'authpri_port',
    label: _('Auth Server Port'),
    fieldset: 'auth',
    defaultValue: '1812',
  }, {
    id: 'acctpri_ipaddr',
    label: _('Accounting Server IP'),
    fieldset: 'Accounting',
  }, {
    id: 'acctpri_port',
    label: _('Accounting Server Port'),
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
      },

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
    let $$myAuthServer = authServer;

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
            {_('Accounting Server Settings')}
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
            {_('Advanced Settings')}
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
        defaultEditData={this.defaultEditData}
        modalChildren={this.renderCustomModal()}
        listKey="template_name"
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
