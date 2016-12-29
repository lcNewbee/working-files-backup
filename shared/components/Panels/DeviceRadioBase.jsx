import React, { PropTypes } from 'react';
import { Map, fromJS } from 'immutable';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { radioBase, $$phymodeOptopns } from 'shared/config/axcRadio';
import FormContainer from '../Organism/FormContainer';

import {
  FormGroup,
} from '../Form';

function getChannelList(countrycode, is5G) {
  return utils.fetch('goform/country/channel', {
    country: countrycode,
  })
    .then((json) => {
      const max24g = json.data['max_2.4g_channel'] || 13;
      const channel5g = json.data.channel_5g;
      const ret = {
        options: [],
      };
      let i = 1;

      if (is5G) {
        ret.options = channel5g.map(
          val => ({
            value: val,
            label: val,
          }),
        );
      } else {
        for (i; i <= max24g; i += 1) {
          ret.options.push({
            value: i,
            label: i,
          });
        }
      }
      ret.options.unshift({
        value: 0,
        label: _('Auto'),
      });
      return ret;
    },
  );
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
class DeviceSystem extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
      this.props.store.getIn(['data', 'phymode']) !== nextProps.store.getIn(['data', 'phymode'])) {
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
    const countrycode = props.store.getIn(['data', 'countrycode']);
    const is5g = props.store.getIn(['data', 'phymode']) === 2;
    getChannelList(countrycode, is5g)
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
    const formOptions = radioBase.setIn([
      radioBase.findIndex(
        $$item => $$item.get('id') === 'channel',
      ),
      'options',
    ], this.state.$$channelOptions)
    .setIn([
      radioBase.findIndex(
        $$item => $$item.get('id') === 'phymode',
      ),
      'options',
    ], this.state.$$phymodeOptopns);

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
            label={_('Select Network Adapter')}
            value={this.getCurData('activeIndex')}
            options={this.getCurData('radiosOptions')}
            onChange={option => this.props.onChangeItem({
              configurationRadioIndex: option.value,
            })}
          />,
        ]}
        hasSaveButton={actionable}
      />
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
