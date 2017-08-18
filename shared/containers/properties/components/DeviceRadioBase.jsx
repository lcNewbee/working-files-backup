import React from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import utils from 'shared/utils';
import { radioBase, $$phymodeOptopns } from 'shared/config/axcRadio';
import FormContainer from 'shared/components/Organism/FormContainer';
import PureComponent from 'shared/components/Base/PureComponent';

import {
  FormGroup,
} from 'shared/components/Form';

function getChannelList(data) {
  return utils.fetch('goform/country/channel', data)
    .then(
      (json) => {
        const channel = json.data.channel;
        const ret = {
          options: [],
        };

        if (json && json.data && json.data.channel) {
          ret.options = channel.map(
            val => ({
              value: val,
              label: val,
            }),
          );
        }

        return ret;
      },
    );
}
function getSSIDStr($$data) {
  const ret = [];
  const len = 16;
  let curSsid = '';
  let curEnable = 0;

  for (let i = 0; i < len; i += 1) {
    curSsid = $$data.get(`wlan${i}`);
    curEnable = $$data.get(`wlan${i}enable`);
    if (curSsid && curEnable === 1) {
      ret.push(curSsid);
    }
  }
  return ret.join(',');
}

const propTypes = {
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  onSave: PropTypes.func,
  actionable: PropTypes.bool,

  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};

const defaultProps = {
};
class DeviceSystem extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'fetchChannelOptions',
      'onSave',
      'getCurData',
      'transformPhymode',
      'onChangeRadio',
    ]);
    this.state = {
      $$channelOptions: fromJS([]),
      $$phymodeOptopns: fromJS([]),
    };
  }

  componentWillMount() {
    this.fetchChannelOptions(this.props);
    this.transformPhymode(this.props.store.getIn(['data', 'phymodesupport']));
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.store.getIn(['data', 'countrycode']) !== nextProps.store.getIn(['data', 'countrycode']) ||
        this.props.store.getIn(['data', 'phymode']) !== nextProps.store.getIn(['data', 'phymode']) ||
        this.props.store.getIn(['data', 'channelwidth']) !== nextProps.store.getIn(['data', 'channelwidth'])) {
      this.fetchChannelOptions(nextProps);
    }
    if (this.getCurData('phymodesupport') !== nextProps.store.getIn(['data', 'phymodesupport'])) {
      this.transformPhymode(nextProps.store.getIn(['data', 'phymodesupport']));
    }
  }

  onSave() {
    if (this.props.onSave) {
      this.props.onSave('radioBase');
    }
  }
  onChangeRadio(data) {
    const myData = data;
    const phymode = data.phymode;
    const curChannelwidth = this.props.store.getIn(['data', 'channelwidth']);

    if (phymode !== undefined) {
      // 只有20频宽模式
      if ([1, 2, 3, 8].indexOf(phymode) !== -1) {
        myData.channelwidth = 20;
      } else if (phymode < 16 && curChannelwidth >= 80) {
        myData.channelwidth = 50;
      }
    }

    if (this.props.onChangeData) {
      this.props.onChangeData(myData);
    }
  }

  getCurData(name) {
    return this.props.store.getIn(['data', name]);
  }
  transformPhymode(phymodesupport) {
    const maxSupport = phymodesupport || 2;

    this.setState({
      $$phymodeOptopns: $$phymodeOptopns.filter(
        ($$item) => {
          let ret = $$item.get('value');

          if (maxSupport >= 8) {
            ret = ret >= 8 && ret <= maxSupport;
          } else {
            ret = $$item.get('value') <= maxSupport;
          }
          return ret;
        },
      ),
    });
  }

  fetchChannelOptions(props) {
    const country = props.store.getIn(['data', 'countrycode']);
    const phymode = props.store.getIn(['data', 'phymode']);
    const channelwidth = props.store.getIn(['data', 'channelwidth']);
    getChannelList({
      country,
      phymode,
      channelwidth,
    })
      .then(
        (item) => {
          this.setState({
            $$channelOptions: fromJS(item.options),
          });
        },
      );
  }

  render() {
    const { app, store, actionable, ...restProps } = this.props;
    const formData = store.getIn(['data']);
    const formOptions = radioBase.map(
      ($$item) => {
        let $$retItem = $$item;

        if ($$item.get('id') === 'channel') {
          $$retItem = $$retItem.set('options', this.state.$$channelOptions);
        } else if ($$item.get('id') === 'phymode') {
          $$retItem = $$retItem.set('options', this.state.$$phymodeOptopns);
        }

        return $$retItem;
      },
    )
      .push(fromJS({
        id: 'ssids',
        label: __('Enable SSID'),
        type: 'checkboxs',
        value: getSSIDStr(formData),
        visible($$data) {
          return parseInt($$data.get('radioenable'), 10) === 1;
        },
        options: ($$data) => {
          const $$ret = [];
          const len = 16;
          let curSsid = '';

          for (let i = 0; i < len; i += 1) {
            curSsid = $$data.get(`wlan${i}`);
            if (curSsid) {
              $$ret.push({
                value: curSsid,
                label: curSsid,
                key: `wlan${i}enable`,
              });
            }
          }
          return $$ret;
        },

        onChange(data) {
          const retData = utils.extend({}, data);

          retData.mergeData = {
            [data.key]: data.checked ? 1 : 0,
          };

          return retData;
        },
      }));


    return (
      <FormContainer
        {...restProps}
        method="POST"
        data={formData}
        className="o-form o-form--compassed"
        options={formOptions}
        isSaving={app.get('saving')}
        onSave={this.onSave}
        onChangeData={this.onChangeRadio}
        header={[
          <FormGroup
            key="dapterSelect"
            type="switch"
            inputStyle={{
              display: 'block',
            }}
            label={__('Select Network Adapter')}
            value={this.getCurData('activeIndex')}
            options={this.getCurData('radiosOptions')}
            onChange={option => this.props.onChangeItem({
              configurationRadioIndex: option.value,
            })}
          />,
        ]}
        actionable={actionable}
        hasSaveButton={actionable}
        saveText={__('Apply')}
        savingText={__('Applying')}
        savedText={__('Applied')}
      />
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
