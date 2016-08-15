import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo, FormGroup, Modal, SaveButton, FormInput, Switchs,
} from 'shared/components';
import * as listActions from 'shared/actions/list';
import * as appActions from 'shared/actions/app';

const blcklistTableOptions = fromJS([
  {
    id: 'ssid',
    text: _('SSID'),
  }, {
    id: 'hiddenSsid',
    text: _('是否隐藏SSID'),
    filter: 'checkbox',
  }, {
    id: 'vlanId',
    text: _('VLAN ID'),
  }, {
    id: 'storeForwardPattern',
    text: _('数据转发模式'),
  }, {
    id: 'encryption',
    text: _('Encryption'),
  }, {
    id: 'compulsoryAuth',
    text: _('802.1X认证'),
    filter: 'checkbox',
  }, {
    id: 'enabled',
    text: _('射频开关'),
    filter: 'checkbox',
  },
]);
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
const msg = {
  upSpeed: _('Up Speed'),
  downSpeed: _('Down Speed'),
  selectGroup: _('Select Group'),
};
const qosType = fromJS([
  {
    value: 'ssid',
    label: _('Base On SSID'),
  }, {
    value: 'user',
    label: _('Base On Users'),
  },
]);
const validOptions = Map({
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 31]',
  }),
  vlanid: validator({
    rules: 'num:[2, 4095]',
  }),
  ssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]',
  }),
  upstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
  downstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
});

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  validateOption: PropTypes.object,
  route: PropTypes.object,
  initList: PropTypes.func,
  save: PropTypes.func,
  addListItem: PropTypes.func,
  closeListItemModal: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  updateEditListItem: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
    this.getCurrData = this.getCurrData.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  onSave() {
    this.props.onListAction();
  }
  onAction(action, mac) {
    const query = {
      mac,
      action,
    };

    this.props.save('/goform/blacklist', query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log(11);
        }
      });
  }
  onUpdateSettings(name) {
    return (item) => {
      const data = {};

      data[name] = item.value;
      this.props.updateEditListItem(data);
    };
  }

  getCurrData(name) {
    return this.props.store.getIn([this.props.route.id, 'data', 'edit', name]);
  }

  render() {
    const { route, store, vlan } = this.props;
    const editData = store.getIn([route.id, 'data', 'edit']) || Map({});
    const getCurrData = this.getCurrData;
    const {
      password, ssid, upstream, downstream,
    } = this.props.validateOption;
    const vlanOption = vlan.get('list').map((item) => ({
      value: item.get('id'),
      label: item.get('id'),
    })).toJS();
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

    return (
      <ListInfo
        {...this.props}
        tableOptions={blcklistTableOptions}
        controlAbled
      >
        <Modal
          isShow={!editData.isEmpty()}
          title={editData.get('myTitle')}
          onOk={() => this.props.closeListItemModal(route.id)}
          onClose={() => this.props.closeListItemModal(route.id)}
          cancelButton={false}
          okButton={false}
        >
          <FormGroup
            label={_('SSID')}
            value={getCurrData('ssid')}
            maxLength="31"
            id="ssid"
            onChange={this.onUpdateSettings('ssid')}
            required
            {...ssid}
          />
          <FormGroup
            label={_('Description')}
            value={getCurrData('remark')}
            maxLength="64"
            onChange={this.onUpdateSettings('remark')}
            required
          />
          <FormGroup
            label={_('VLAN ID')}
            type="select"
            options={vlanOption}
            value={getCurrData('vlanid')}
            maxLength="4"
            onChange={this.onUpdateSettings('vlanid')}
            required
          />
          <FormGroup
            label={_('Enable SSID')}
            type="checkbox"
            checked={getCurrData('enabled') === '1'}
            onChange={this.onUpdateSettings('enabled')}
          />
          <FormGroup
            label={_('Hidden SSID')}
            type="checkbox"
            checked={getCurrData('hiddenSsid') === '1'}
            onChange={this.onUpdateSettings('hiddenSsid')}
          />
          <FormGroup
            label={_('Load Balancing')}
            type="checkbox"
            checked={getCurrData('loadBalancing') === '1'}
            onChange={this.onUpdateSettings('loadBalancing')}
          />

          <FormGroup
            label={_('Max Users')}
            type="number"
            value={getCurrData('maxBssUsers')}
            onChange={this.onUpdateSettings('maxBssUsers')}
          />
          <FormGroup
            label={_('Store-Forward Pattern')}
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
            {_('limited to') + ' '}
            <FormInput
              type="number"
              maxLength="6"
              size="sm"
              disabled={getCurrData('downstream') === '0'}
              value={getCurrData('downstream')}
              onChange={this.onUpdateSettings('downstream')}
            />
          </FormGroup>
          <FormGroup
            type="select"
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

          <div className="form-group form-group-save">
            <div className="form-control">
              <SaveButton
                type="button"
                loading={this.props.app.get('saving')}
                onClick={this.onSave}
              />
            </div>
          </div>
        </Modal>
      </ListInfo>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    vlan: state.mainAxc.get('vlan'),
    store: state.list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    listActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(View);
