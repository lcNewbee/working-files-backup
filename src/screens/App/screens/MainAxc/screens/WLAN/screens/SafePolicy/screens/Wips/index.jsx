import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo, FormGroup, Modal, Checkbox,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
import channels from 'shared/config/country.json';

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
    text: _('Access Point Work Mode'),
  }, {
    id: 'protectMode',
    text: _('扫描类型'),
  }, {
    id: 'protectMode',
    text: _('Max Power'),
  }, {
    id: 'protectMode',
    text: _('Min Power'),
  }, {
    id: 'ap24gMode',
    text: _('2.4G校准间隔'),
  }, {
    id: 'ap5gMode',
    text: _('2.4G邻居系数'),
  }, {
    id: 'protect24gMode',
    text: _('2.4G timeid'),
  }, {
    id: 'protect5gMode',
    text: _('5G校准间隔'),
  },
]);
const apWorkModeOptions = [
  {
    value: '0',
    label: _('正常工作模式'),
  }, {
    value: '1',
    label: _('扫描优先'),
  },
];
const scanTypeOptions = [
  {
    value: 'date',
    label: _('被动扫描'),
  }, {
    value: 'week',
    label: _('主动扫描'),
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
              options={apWorkModeOptions}
              value={getCurrData('aps')}
              onChange={this.onUpdateSettings('aps')}
            />
            <FormGroup
              type="select"
              label={_('扫描类型')}
              options={scanTypeOptions}
              value={getCurrData('protectMode')}
              onChange={this.onUpdateSettings('protectMode')}
            />
            <FormGroup
              type="number"
              label={_('Max Power')}
              value={getCurrData('policyName')}
              onChange={this.onUpdateSettings('policyName')}
            />
            <FormGroup
              type="number"
              label={_('Min Power')}
              value={getCurrData('policyName')}
              onChange={this.onUpdateSettings('policyName')}
            />
            <FormGroup
              type="text"
              label={_('2.4G校准间隔')}
              value={getCurrData('policyName')}
              onChange={this.onUpdateSettings('policyName')}
            />
            <FormGroup
              type="text"
              label={_('2.4G邻居系数')}
              value={getCurrData('policyName')}
              onChange={this.onUpdateSettings('policyName')}
            />
            <FormGroup
              type="text"
              label={_('2.4G频段timeid')}
              value={getCurrData('policyName')}
              onChange={this.onUpdateSettings('policyName')}
            />
            <FormGroup
              type="text"
              label={_('5G校准间隔')}
              value={getCurrData('policyName')}
              onChange={this.onUpdateSettings('policyName')}
            />
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
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(View);
