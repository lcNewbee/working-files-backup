import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { authServer, advancedSetting, accServer } from 'shared/config/axcRadius';
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
    id: 'template_name',
    label: _('Name'),
    type: 'text',
    maxLength: '32',
    required: true,
    notEditable: true,
    defaultValue: '',
  }, {
    id: 'authpri_ipaddr',
    label: _('Primary Auth Server IP'),
    fieldset: 'auth',
    legend: _('Primary Auth Server Settings'),
  }, {
    id: 'authpri_port',
    label: _('Primary Auth Server Port'),
    fieldset: 'auth',
    defaultValue: '1812',
  }, {
    id: 'acctpri_ipaddr',
    label: _('Primary Acc IP'),
    fieldset: 'Accounting',
    legend: _('Accounting Server Settings'),
    defaultValue: '',
  }, {
    id: 'acctpri_port',
    label: _('Primary Acc Port'),
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
