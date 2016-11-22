import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { SaveButton, Button } from 'shared/components/Button';
import { FormGroup, FormInput } from 'shared/components/Form';
import Modal from 'shared/components/Modal';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const msg = {
  upSpeed: _('Up Speed'),
  downSpeed: _('Down Speed'),
  selectGroup: _('Select Group'),
};
const encryptionOptions = [
  {
    value: 'none',
    label: _('NONE'),
  },
  {
    value: 'psk-mixed',
    label: _('STRONG'),
  },
];
const loadBalanceTypeArr = [
  {
    value: 0,
    label: _('Disable'),
  }, {
    value: 1,
    label: _('Users'),
  }, {
    value: 2,
    label: _('Flow'),
  },
];

const validOptions = Map({
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 31]',
  }),
  vlanid: validator({
    rules: 'num:[2, 4095]',
  }),
  ssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 32]',
  }),
  upstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
  downstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
  maxUser: validator({
    rules: 'num:[1, 64]',
  }),
});
const storeForwardOption = [
  {
    value: 'local',
    label: _('Local Forward'),
  }, {
    value: 'centralized-802.3',
    label: _('Centralized Forward-%s Tunnel', '802.3'),
  }, {
    value: 'centralized-802.11',
    label: _('Centralized Forward-%s Tunnel', '802.11'),
  },
];
const flowRateFilter = utils.filter('flowRate:["KB/s"]');
const listOptions = fromJS([
  {
    id: 'ssid',
    notEditable: true,
    text: _('SSID'),
    formProps: {
      type: 'text',
      maxLength: '32',
      required: true,
      notEditable: true,
    },
  }, {
    id: 'hiddenSsid',
    text: _('Hidde SSID'),
    options: [
      {
        value: '1',
        label: _('YES'),
        render() {
          return (
            <span
              style={{
                color: 'red',
              }}
            >
              {_('YES')}
            </span>
          );
        },
      }, {
        value: '0',
        label: _('NO'),
        render() {
          return (
            <span
              style={{
                color: 'green',
              }}
            >
              {_('NO')}
            </span>
          );
        },
      },
    ],
    defaultValue: '0',
  }, {
    id: 'storeForwardPattern',
    options: storeForwardOption,
    text: _('Forward Pattern'),
    defaultValue: 'local',
  }, {
    id: 'encryption',
    text: _('Encryption'),
    defaultValue: 'psk-mixed',
  }, {
    id: 'upstream/downstream',
    text: _('Up/Down Flow'),
    transform(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}/${downRate}`;
    },
  }, {
    id: 'maxBssUsers',
    text: _('Max Users'),
    defaultValue: 32,
  }, {
    id: 'enabled',
    text: _('Status'),
    options: [
      {
        value: '1',
        label: _('On'),
        render() {
          return (
            <span
              style={{
                color: 'green',
              }}
            >
              {_('On')}
            </span>
          );
        },
      }, {
        value: '0',
        label: _('Off'),
        render() {
          return (
            <span
              style={{
                color: 'red',
              }}
            >
              {_('Off')}
            </span>
          );
        },
      },
    ],
    defaultValue: '1',
  }, {
    id: 'loadBalanceType',
    defaultValue: 1,
    options: loadBalanceTypeArr,
  }, {
    id: 'upstream',
    defaultValue: '0',
    noTable: true,
  }, {
    id: 'downstream',
    defaultValue: '0',
    noTable: true,
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  group: PropTypes.instanceOf(Map),
  validateOption: PropTypes.object,
  route: PropTypes.object,
  groupid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  closeListItemModal: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  updateCustomProps: PropTypes.func,
  onListAction: PropTypes.func,
  validateAll: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.getCurrData = this.getCurrData.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);
    this.onSave = this.onSave.bind(this);

    utils.binds(this, [
      'renderActionBar',
      'onCopySsid',
      'onSelectCopyFromGroup',
      'renderUpdateSsid',
      'renderCopySsid',
    ]);
  }
  componentDidMount() {
    this.props.changeScreenActionQuery({
      groupid: this.props.groupid,
    });
  }
  onSave() {
    this.props.validateAll()
      .then(($$msg) => {
        if ($$msg.isEmpty()) {
          this.props.onListAction();
        }
      });
  }
  onUpdateSettings(name) {
    return (item) => {
      const data = {};

      data[name] = item.value;
      this.props.updateCurEditListItem(data);
    };
  }
  onCopySsid() {
    this.props.changeScreenActionQuery({
      action: 'copy',
      myTitle: _('Copy Form Other Group'),
    });
  }
  onSelectCopyFromGroup(groupId, e) {
    e.preventDefault();
    this.props.updateScreenCustomProps({
      copyFromGroupId: groupId,
    });
  }

  getCurrData(name) {
    return this.props.store.getIn([this.props.route.id, 'curListItem', name]);
  }

  renderActionBar() {
    return (
      <Button
        text="Copy Form Other Group"
        icon="copy"
        theme="primary"
        onClick={() => this.onCopySsid()}
      />
    );
  }

  renderUpdateSsid() {
    const { route, store, app } = this.props;
    const actionQuery = store.getIn([route.id, 'actionQuery']) || Map({});
    const getCurrData = this.getCurrData;
    const {
      password, ssid, upstream, downstream, maxUser,
    } = this.props.validateOption;

    return (
      <div>
        <FormGroup
          label={_('SSID')}
          value={getCurrData('ssid')}
          maxLength="32"
          id="ssid"
          disabled={actionQuery.get('action') === 'edit'}
          onChange={this.onUpdateSettings('ssid')}
          required
          {...ssid}
        />
        <FormGroup
          label={_('Description')}
          value={getCurrData('remark')}
          maxLength="64"
          onChange={this.onUpdateSettings('remark')}
        />
        <FormGroup
          label={_('Enable SSID')}
          type="checkbox"
          checked={getCurrData('enabled') === '1'}
          onChange={this.onUpdateSettings('enabled')}
        />
        <FormGroup
          label={_('SSID Isolation')}
          type="checkbox"
          checked={getCurrData('ssidIsolation') === '1'}
          onChange={this.onUpdateSettings('ssidIsolation')}
        />
        <FormGroup
          label={_('Hidde SSID')}
          type="checkbox"
          checked={getCurrData('hiddenSsid') === '1'}
          onChange={this.onUpdateSettings('hiddenSsid')}
        />
        <FormGroup
          label={_('Load Balancing')}
          type="switch"
          options={loadBalanceTypeArr}
          value={getCurrData('loadBalanceType')}
          onChange={this.onUpdateSettings('loadBalanceType')}
        />
        <FormGroup
          label={_('Max Users')}
          min="1"
          max="64"
          type="number"
          value={getCurrData('maxBssUsers')}
          onChange={this.onUpdateSettings('maxBssUsers')}
          required
          {...maxUser}
        />
        <FormGroup
          label={_('Forward Pattern')}
          type="select"
          options={storeForwardOption}
          value={getCurrData('storeForwardPattern')}
          onChange={this.onUpdateSettings('storeForwardPattern')}
        />
        <FormGroup
          label={msg.upSpeed}
          help="KB/s"
          required={getCurrData('upstream') !== '0'}
          value={getCurrData('upstream')}
          {...upstream}
        >
          <FormInput
            type="checkbox"
            value="64"
            checked={getCurrData('upstream') === '' || getCurrData('upstream') > 0}
            onChange={this.onUpdateSettings('upstream')}
          />
          {`${_('limited to')} `}
          <FormInput
            type="number"
            min="0"
            max="999999"
            maxLength="6"
            size="sm"
            disabled={getCurrData('upstream') === '0'}
            value={getCurrData('upstream')}
            onChange={this.onUpdateSettings('upstream')}
          />
        </FormGroup>

        <FormGroup
          type="number"
          label={msg.downSpeed}
          help="KB/s"
          maxLength="6"
          required={getCurrData('downstream') !== '0'}
          value={getCurrData('downstream')}
          {...downstream}
        >
          <FormInput
            type="checkbox"
            value="256"
            checked={getCurrData('downstream') === '' || getCurrData('downstream') > 0}
            onChange={this.onUpdateSettings('downstream')}
          />
          {`${_('limited to')} `}
          <FormInput
            type="number"
            min="0"
            max="999999"
            maxLength="6"
            size="sm"
            disabled={getCurrData('downstream') === '0'}
            value={getCurrData('downstream')}
            onChange={this.onUpdateSettings('downstream')}
          />
        </FormGroup>
        <FormGroup
          type="switch"
          label={_('Encryption')}
          options={encryptionOptions}
          value={getCurrData('encryption')}
          onChange={this.onUpdateSettings('encryption')}
        />
        {
          getCurrData('encryption') === 'psk-mixed' ?
            <FormGroup
              label={_('Password')}
              type="password"
              required
              value={getCurrData('password')}
              onChange={this.onUpdateSettings('password')}
              maxLength="31"
              {...password}
            /> : ''
        }
        <div className="form-group form-group--save">
          <div className="form-control">
            <SaveButton
              type="button"
              loading={app.get('isSaving')}
              onClick={this.onSave}
            />
          </div>
        </div>
      </div>
    );
  }

  renderCopySsid() {
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$group = this.props.group;
    const selectGroupId = $$group.getIn(['selected', 'id']);
    const copyFromGroupId = $$myScreenStore.getIn(['customProps', 'copyFromGroupId']);

    return (
      <div className="o-list">
        <h3 className="o-list__header">{_('Group List')}</h3>
        <ul className="m-menu m-menu--open">
          {
            $$group.getIn(['list']).map((item) => {
              const curId = item.get('id');
              let classNames = 'm-menu__link';

              // 不能管理 All Group
              if (curId === selectGroupId || curId === -100) {
                return null;
              }

              if (curId === copyFromGroupId) {
                classNames = `${classNames} active`;
              }

              return (
                <li key={curId}>
                  <a
                    className={classNames}
                    onClick={
                      e => this.onSelectCopyFromGroup(curId, e)
                    }
                  >
                    {item.get('groupname')}
                  </a>
                </li>
              );
            })
          }
        </ul>
        <div className="form-group form-group--save">
          <div className="form-control">
            <SaveButton
              type="button"
              loading={app.get('isSaving')}
              onClick={this.onSave}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { route, store } = this.props;
    const actionQuery = store.getIn([route.id, 'actionQuery']) || Map({});
    const isUpdateSsid = actionQuery.get('action') === 'edit' ||
        actionQuery.get('action') === 'add';
    const isCopySsid = actionQuery.get('action') === 'copy';
    const actionBarChildren = this.renderActionBar();

    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        listKey="allKeys"
        actionBarChildren={actionBarChildren}
        customModal
        actionable
        selectable
      >
        <Modal
          isShow={isUpdateSsid || isCopySsid}
          title={actionQuery.get('myTitle')}
          onClose={
            () => this.props.closeListItemModal(route.id)
          }
          noFooter
        >
          {
            isUpdateSsid ?
              this.renderUpdateSsid() :
              this.renderCopySsid()
          }
        </Modal>
      </AppScreen>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    group: state.product.get('group'),
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
  validator.mergeProps(validOptions),
)(View);
