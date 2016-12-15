import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { authServer, advancedSetting, accServer, radiusName } from 'shared/config/axcRadius';
// import { Button } from 'shared/components/Button';
import AppScreen from 'shared/components/Template/AppScreen';
import FormContainer from 'shared/components/Organism/FormContainer';
import Icon from 'shared/components/Icon';
// custom
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

const listOptions = fromJS([
  {
    id: 'template_name',
    label: _('Name'),
    type: 'text',
    maxLength: '32',
    required: true,
    notEditable: true,
  }, {
    id: 'authpri_ipaddr',
    label: _('Primary Auth IP'),
    fieldset: 'auth',
    legend: _('Primary Auth Server Settings'),
    type: 'text',
  }, {
    id: 'authpri_port',
    label: _('Primary Auth Port'),
    fieldset: 'auth',
    defaultValue: '1812',
    type: 'number',
  }, {
    id: 'authpri_key',
    label: _('Primary Auth Password'),
    fieldset: 'auth',
    noTable: true,
    type: 'password',
  }, {
    id: 'acctpri_ipaddr',
    label: _('Primary Acc IP'),
    fieldset: 'Accounting',
    legend: _('Accounting Server Settings'),
    defaultValue: '0',
    type: 'text',
  }, {
    id: 'acctpri_port',
    label: _('Primary Acc Port'),
    fieldset: 'Accounting',
    defaultValue: '0',
    type: 'number',
  }, {
    id: 'acctpri_key',
    label: _('Primary Acc Password'),
    fieldset: 'Accounting',
    defaultValue: '0',
    noTable: true,
    type: 'password',
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  validateAll: PropTypes.func,
  fetchScreenData: PropTypes.func,
  saveScreenSettings: PropTypes.func,
  updateScreenSettings: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
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
  }

  onSave(formId) {
    if (this.props.validateAll) {
      this.props.validateAll(formId)
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            this.props.saveScreenSettings();
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
    const actionType = $$myScreenStore.getIn(['actionQuery', 'action']);

    if (actionType !== 'add' && actionType !== 'edit') {
      return null;
    }

    return (
      <div className="o-box row">
          <FormContainer
            id="radiusName"
            options={radiusName}
            data={$$curData}
            onChangeData={this.props.updateScreenSettings}
            onSave={() => this.onSave('radiusName')}
            invalidMsg={app.get('invalid')}
            validateAt={app.get('validateAt')}
            isSaving={app.get('saving')}
          />
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
            {_('Auth Server Settings')}
          </h3>
        </div>
        {
          this.state.isBaseShow ? (
            <div className="o-box__cell">
              <FormContainer
                id="authServer"
                options={authServer}
                data={$$curData}
                onChangeData={this.props.updateScreenSettings}
                onSave={() => this.onSave('authServer')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
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
                data={$$curData}
                onChangeData={this.props.updateScreenSettings}
                onSave={() => this.onSave('accServer')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
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
                onChangeData={this.props.updateScreenSettings}
                onSave={() => this.onSave('advancedSetting')}
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
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
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
