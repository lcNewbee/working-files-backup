import React, { PropTypes } from 'react';
import { Map, List, fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import channels from 'shared/config/country.json';

import {
  FormGroup,
} from '../Form';

import {
  SaveButton,
} from '../Button';

const channelBandwidthOptions = fromJS([
  {
    value: 20,
    label: '20',
  }, {
    value: 40,
    label: '40',
  },
]);
const channelsList = List(channels);
const countryOptions = channelsList.map(function (item) {
  return {
    value: item.country,
    label: b28n.getLang() === 'cn' ? _(item.cn) : _(item.en),
  };
}).toJS();

const propTypes = {
  onCollapse: PropTypes.func,
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  onRemove: PropTypes.func,
  onSave: PropTypes.func,

  isCollapsed: PropTypes.bool,
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};

const defaultProps = {
};
class DeviceSystem extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSave = this.onSave.bind(this);
    this.getCurData = this.getCurData.bind(this)
  }
  onSave() {
    if (this.props.onSave) {
      this.props.onSave();
    }
  }
  onChangeData(data) {
  }
  getCurData(name) {
    return this.props.store.getIn(['data', name])
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
        value: i,
        label: `${i}`,
      });
    }

    return channelsOptions;
  }
  render() {
    const { app } = this.props;
    const { getCurData } = this;
    const channelsOptions = this.getChannelsOptions('CN');

    return (
      <div className="o-form o-form--compassed">
        <FormGroup
          type="checkbox"
          text="Switch Radio"
          value='1'
          checked={getCurData('enable') == 1}
          onChange={(option) => this.props.onChangeData({
            enable: option.value,
          })}
        />
        <FormGroup
          type="switch"
          label={_('Work Mode')}
          options={[
            {
              value: 1,
              label: '11n',
            }, {
              value: 2,
              label: '11g',
            }, {
              value: 3,
              label: '11b',
            }, {
              value: 4,
              label: '11ac',
            }
          ]}
          value={getCurData('phymode')}
          onChange={(option) => this.props.onChangeData({
            phymode: option.value,
          })}
        />
        <FormGroup
          type="select"
          label={_('Country')}
          options={countryOptions}
          value={getCurData('countrycode')}
          onChange={(option) => this.props.onChangeData({
            countrycode: option.value,
          })}
        />

        <div className="row">
          <div className="cols col-6">
            <FormGroup
              type="select"
              label={_('Channel')}
              options={channelsOptions}
              value={getCurData('channel')}
              onChange={(option) => this.props.onChangeData({
                channel: option.value,
              })}
            />
          </div>
          <div className="cols col-6">
            <FormGroup
              type="switch"
              label={_('Channel Width')}
              options={channelBandwidthOptions}
              value={getCurData('channelwidth')}
              onChange={(option) => this.props.onChangeData({
                channelwidth: option.value,
              })}
            />
          </div>
        </div>
        <FormGroup
          type="range"
          min="1"
          max="35"
          label={_('Tx Power')}
          inputStyle={{
            width: '88%'
          }}
          help={getCurData('txpower')}
          options={channelsOptions}
          value={parseInt(getCurData('txpower'))}
          onChange={(option) => this.props.onChangeData({
            txpower: `${option.value}db`,
          })}
        />
        <div className="form-group--save">
          <SaveButton
            size="sm"
            loading={app.get('saving')}
            onClick={this.props.onSave}
          />
        </div>
      </div>
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
