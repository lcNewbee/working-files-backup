import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo, FormGroup, Modal, SaveButton, Checkbox, FormInput,
} from 'shared/components';
import * as listActions from 'shared/actions/list';
import * as appActions from 'shared/actions/app';
import channels from 'shared/config/channels.json';

const channelsList = List(channels);
const msg = {
  apMode24g: `${_('Access Point Mode')}(2.4G)`,
  apMode5g: `${_('Access Point Mode')}(5G)`,
  protectChannel24g: `${_('Protect Channel')}(2.4G)`,
  protectChannel5g: `${_('Protect Channel')}(5G)`,
};

const blcklistTableOptions = fromJS([
  {
    id: 'policyName',
    text: _('Policy Name'),
    width: '120',
  }, {
    id: 'opObject',
    width: '120',
    text: _('Access Point'),
  }, {
    id: 'protectMode',
    text: _('Protect Mode'),
  }, {
    id: 'ap24gMode',
    text: msg.apMode24g,
  }, {
    id: 'ap5gMode',
    text: msg.apMode5g,
  }, {
    id: 'protect24gMode',
    text: msg.protectChannel24g,
  }, {
    id: 'protect5gMode',
    text: msg.protectChannel5g,
  },
]);
const apOptions = [
  {
    value: '0',
    label: _('只执行一次'),
  }, {
    value: '1',
    label: _('每天'),
  }, {
    value: '2',
    label: _('周一至周五'),
  }, {
    value: '3',
    label: _('法定节假日'),
  }, {
    value: '4',
    label: _('法定工作日'),
  }, {
    value: '5',
    label: _('自定义'),
  },
];
const channelBandwidthOptions = fromJS([
  {
    value: 'date',
    label: _('Date'),
  }, {
    value: 'week',
    label: _('Week'),
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
    this.props.onListAction()
      .then(() => {
        this.props.closeListItemModal();
      });
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
  onUpdateTime(moment, ddd) {
    console.log(moment.format('HH:mm'), ddd);
  }

  getCurrData(name) {
    return this.props.store.getIn([this.props.route.id, 'data', 'edit', name]) || '';
  }
  getCountryOptions() {
    return channelsList.map((item) => ({
      value: item.country,
      label: b28n.getLang() === 'cn' ? _(item.cn) : _(item.en),
    })).toJS();
  }

  getChannelsOptions(currCountry) {
    let i;
    let len;
    let channelsRange;
    const channelsOptions = [
      {
        value: '0',
        label: _('auto'),
      },
    ];
    const channelsOption = channelsList.find((item) => {
      return item.country === currCountry;
    });

    if (channelsOption) {
      channelsRange = channelsOption['2.4g'].split('-');
      i = parseInt(channelsRange[0], 10);
      len = parseInt(channelsRange[1], 10);
    } else {
      i = 1;
      len = 13;
    }

    for (i; i <= len; i++) {
      channelsOptions.push({
        value: `${i}`,
        label: `${i}`,
      });
    }

    return channelsOptions;
  }

  render() {
    const { route, store } = this.props;
    const editData = store.getIn([route.id, 'data', 'edit']) || Map({});
    const getCurrData = this.getCurrData;
    const channelsOptions = this.getChannelsOptions(getCurrData('country'));
    const {
      password, vlanid, ssid, upstream, downstream,
    } = this.props.validateOption;

    const tableOptions = blcklistTableOptions.push(fromJS({
      id: 'enabled',
      width: '60',
      text: _('Status'),
      transform(val) {
        return (
          <Checkbox
            checked={val === '1'}
            style={{
              marginTop: '3px',
            }}
          />
        );
      },
    }));

    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        defaultItem={{
          dataType: 'date',
        }}
        noTitle
        actionable
      >
        <Modal
          isShow={!editData.isEmpty()}
          title={editData.get('myTitle')}
          onOk={() => this.onSave()}
          onClose={() => this.props.closeListItemModal()}
        >
          <div className="o-form">
            <FormGroup
              label={_('Enable The Policy')}
              type="checkbox"
              className="o-form__switch-bar"
            />
            <FormGroup
              type="text"
              label={_('Policy Name')}
              value={getCurrData('policyName')}
              onChange={this.onUpdateSettings('policyName')}
            />
            <FormGroup
              type="select"
              label={_('Access Point Work Mode')}
              options={apOptions}
              value={getCurrData('aps')}
              onChange={this.onUpdateSettings('aps')}
            />
            <FormGroup
              type="select"
              label={_('扫描类型')}
              options={apOptions}
              value={getCurrData('protectMode')}
              onChange={this.onUpdateSettings('protectMode')}
            />
            <fieldset className="o-form__fieldset">
              <legend className="o-form__legend">{_('Protect Settings')}</legend>
              <FormGroup
                type="select"
                label={msg.apMode24g}
                options={apOptions}
                value={getCurrData('ap24gMode')}
                onChange={this.onUpdateSettings('ap24gMode')}
              />
              <FormGroup
                type="select"
                label={msg.apMode5g}
                options={apOptions}
                value={getCurrData('ap5gMode')}
                onChange={this.onUpdateSettings('ap5gMode')}
              />
              <FormGroup
                type="select"
                label={msg.protectChannel24g}
                options={apOptions}
                value={getCurrData('protect24gMode')}
                onChange={this.onUpdateSettings('protect24gMode')}
              />
              <FormGroup
                type="select"
                label={msg.protectChannel5g}
                options={apOptions}
                value={getCurrData('protect5gMode')}
                onChange={this.onUpdateSettings('protect5gMode')}
              />
            </fieldset>

            <fieldset className="o-form__fieldset">
              <legend className="o-form__legend">{_('Rogue Access Ooint Detection')}</legend>
              <FormGroup>
                <div className="row">
                  <FormInput
                    type="checkbox"
                    theme="square"
                    text={_('钓鱼接入点及随身WIFI检测')}
                  />
                </div>
                <div className="row">
                  <FormInput
                    type="checkbox"
                    theme="square"
                    text={_('将来在本NAC上激活的的接入点视为非法接入点')}
                    style={{
                      marginLeft: '2em',
                    }}
                  />
                </div>
                <div className="row">
                  <FormInput
                    type="checkbox"
                    theme="square"
                    text={_('将隐藏SSID的接入点视为非法接入点')}
                    style={{
                      marginLeft: '2em',
                    }}
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <FormInput
                  type="checkbox"
                  theme="square"
                  text={_('AD-Hot检测')}
                />
              </FormGroup>
            </fieldset>
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
