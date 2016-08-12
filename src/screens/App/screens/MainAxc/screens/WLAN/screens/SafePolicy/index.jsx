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
import channels from 'shared/config/channels.json';

const channelsList = List(channels);

const blcklistTableOptions = fromJS([
  {
    id: 'policyName',
    text: _('Policy Name'),
  }, {
    id: 'opObject',
    text: _('Policy Type'),
  }, {
    id: 'opObject',
    text: _('Operate Object'),
  }, {
    id: 'operation',
    text: _('Operation'),
  }, {
    id: 'dateType',
    text: _('时限类型'),
  }, {
    id: 'month',
    text: _('Month'),
  }, {
    id: 'days',
    text: _('Days'),
  }, {
    id: 'timerRange',
    text: _('时段'),
    transform(val, item) {
      return `${item.get('startTime')} - ${item.get('endTime')}`;
    },
  }, {
    id: 'remark',
    text: _('Remark'),
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
    const countryOptions = this.getCountryOptions();
    const channelsOptions = this.getChannelsOptions(getCurrData('country'));
    const {
      password, vlanid, ssid, upstream, downstream,
    } = this.props.validateOption;

    return (
      <ListInfo
        {...this.props}
        tableOptions={blcklistTableOptions}
        defaultItem={{
          dataType: 'date',
        }}
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
            label={_('Policy Name')}
            value={getCurrData('policyName')}
            maxLength="31"
            onChange={this.onUpdateSettings('policyName')}
            required
          />

          <FormGroup
            type="select"
            label={_('Operate Object')}
            value={getCurrData('opObject')}
          />

          <FormGroup
            label={_('Enable The Policy')}
            type="checkbox"
          />

          <FormGroup label={_('Timer Type')} >
            <Switchs
              options={channelBandwidthOptions}
              value={getCurrData('dateType')}
              onChange={this.onUpdateSettings('dateType')}
            />
          </FormGroup>
          {
            getCurrData('dateType') === 'date' ? (
              <div>
                <FormGroup
                  type="select"
                  label={_('Month')}
                  options={channelsOptions}
                  value={getCurrData('month')}
                  onChange={this.onUpdateSettings('month')}
                />
                <FormGroup
                  type="select"
                  label={_('Days')}
                  options={channelsOptions}
                  value={getCurrData('day')}
                  onChange={this.onUpdateSettings('days')}
                />
              </div>
            ) : null
          }

          {
            getCurrData('dateType') === 'week' ? (
              <FormGroup
                type="select"
                label={_('Weeks')}
                options={channelsOptions}
                value={getCurrData('week')}
                onChange={this.onUpdateSettings('week')}
              />
            ) : null
          }

          <FormGroup
            type="text"
            label={_('Start Time')}
            options={channelsOptions}
            value={getCurrData('startTime')}
            onChange={this.onUpdateSettings('startTime')}
          />
          <FormGroup
            type="text"
            label={_('End Time')}
            options={channelsOptions}
            value={getCurrData('endTime')}
            onChange={this.onUpdateSettings('endTime')}
          />

          <FormGroup
            type="text"
            label={_('Description')}
            options={channelsOptions}
            value={getCurrData('remark')}
            onChange={this.onUpdateSettings('remark')}
          />

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
