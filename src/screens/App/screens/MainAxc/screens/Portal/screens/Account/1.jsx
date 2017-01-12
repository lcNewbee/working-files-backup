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
    id: 'loginName',
    text: _('User Name'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'date',
    text: _('Expired Date'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'time',
    text: _('Left Time'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'octets',
    text: _('Left Traffic'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'state',
    text: _('User Type'),
    type: 'text',
    formProps: {
      required: true,
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
    type: 'num',
    formProps: {
      required: true,
    },
  }, {
    id: 'autologin',
    text: _('Auto Login'),
    type: 'text',
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
    type: 'text',
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
    formProps: {
      required: true,
    },
  }, {
    id: 'ex3',
    text: _('Unbind Times'),
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
