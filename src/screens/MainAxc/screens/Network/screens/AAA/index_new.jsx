import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { Icon, FormContainer } from 'shared/components';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import validator from 'shared/validator';

import {
  $$radiusServerChoices, $$radiusAuthServer, $$radiusAccServer, $$radiusAdvancedSetting,
} from './config';

function getInterfaceTypeOptions() {
  return utils.fetch('goform/network/radius/template')
    .then(json => (
      {
        options: json.data.list.filter(
          item => item,
        ).map(
          item => ({
            value: item.template_name,
            label: item.template_name,
          }),
        ),
      }
    ),
  );
}
const MSG = {
  Seconds: __('Seconds'),
  minutes: __('Minutes'),
  hour: __('Hour'),
  hours: __('Hours'),
  days: __('Days'),
  userDef: __('User Defined'),
  imageDes: __('Select 1-3 slide pictures of dimension 640px*640px'),
};
const accessTypeSeletOptions = [
  {
    value: 'portal',
    label: __('Portal'),
  },
  {
    value: '8021x-access',
    label: __('802.1x'),
    disabled: true,
  },
  // {
  //   value: 'lan-access',
  //   label: __('LAN'),
  //   disabled: true,
  // }, {
  //   value: 'ppp-access',
  //   label: __('PPP'),
  //   disabled: true,
  // }, {
  //   value: 'mac-access',
  //   label: __('MAC'),
  //   disabled: true,
  // },
];

const authTypeSeletOptions = [
  {
    value: 'local',
    label: `${__('Local')}`,
  },
  {
    value: 'radius-scheme',
    label: `${__('Remote')}`,
  },
];

// 大于2.5版本
if (window.guiConfig.versionCode >= 20500) {
  // 开启 802.1x
  accessTypeSeletOptions[1].disabled = false;
}
const listOptions = fromJS([
  {
    id: 'domain_name',
    text: __('Name'),
    defaultValue: '',
    notEditable: true,
    formProps: {
      type: 'text',
      required: true,
      maxLength: '31',
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
    },
  },
  {
    id: 'auth_accesstype',
    text: __('Access Type'),
    defaultValue: 'portal',
    options: accessTypeSeletOptions,
    formProps: {
      label: __('Access Type'),
      required: true,
      type: 'switch',
      placeholder: __('Please Select ') + __('Rules Group'),
    },
  },
  {
    id: 'access_server_type',
    text: __('Access Server Type'),
    defaultValue: 'Lo',
    options: authTypeSeletOptions,
    formProps: {
      label: __('Access Server Type'),
      required: true,
      type: 'switch',
    },
  },
  {
    id: 'radius_template',
    text: __('Radius Template'),
    formProps: {
      label: __('Radius Template'),
      required: true,
      type: 'select',
      placeholder: __('Please Select ') + __('Radius Template'),
      options: [],
    },
  },
  {
    id: 'auth_schemetype',
    text: __('Type'),
    defaultValue: 'radius-scheme',
    options: authTypeSeletOptions,
    noTable: true,
    noForm: true,
    formProps: {
      label: __('Type'),
      required: true,
      type: 'switch',
      placeholder: __('Please Select ') + __('Rules Group'),
    },
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  updateCurEditListItem: PropTypes.func,
  reportValidError: PropTypes.func,
  createModal: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'renderCustomModal',
    ]);
    this.state = {
      radiusOptions: [],
    };
  }

  componentWillMount() {
    getInterfaceTypeOptions().then(
      (data) => {
        this.setState({
          radiusOptions: data.options,
        });
      },
    );
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.state.radiusOptions !== nextState.radiusOptions) {
      this.listOptions = listOptions.map(
        ($$item) => {
          let $$ret = $$item;

          if ($$ret.get('id') === 'radius_template') {
            $$ret = $$ret.set('options', this.state.radiusOptions);
          }
          return $$ret;
        },
      );
    }
  }
  renderCustomModal() {
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curData = $$myScreenStore.get('curListItem');

    return (
      <div className="o-box row">
        <div className="o-box__cell">
          <FormContainer
            id="serverChoice"
            className="o-form--compassed"
            options={$$radiusServerChoices}
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
                options={$$radiusAuthServer}
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
                options={$$radiusAccServer}
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
                options={$$radiusAdvancedSetting}
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
        listKey="domain_name"
        renderCustomModal={this.renderCustomModal()}
        listOptions={this.listOptions}
        deleteable={
          ($$item, index) => (index !== 0)
        }
        maxListSize="16"
        customModal
        actionable
        selectable
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
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
