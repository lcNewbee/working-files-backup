import React, { PropTypes } from 'react';
import { Map, List, fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import channels from 'shared/config/country.json';
import FormContainer from '../Organism/FormContainer';
import {
  FormGroup,
} from '../Form';

import {
  SaveButton,
} from '../Button';

const channelBandwidthOptions = fromJS([
  {
    value: 5,
    label: '5',
  }, {
    value: 10,
    label: '10',
  }, {
    value: 20,
    label: '20',
  }, {
    value: 40,
    label: '40',
  }, {
    value: 80,
    label: '80',
  },
]);
const channelsList = List(channels);
const countryOptions = channelsList.map(item =>
  ({
    value: item.country,
    label: b28n.getLang() === 'cn' ? _(item.cn) : _(item.en),
  }),
).toJS();

function getChannelsOptions(currCountry) {
  let i;
  let len;
  let channelsRange;
  const channelsOptions = [
    {
      value: '0',
      label: _('auto'),
    },
  ];
  const channelsOption = channelsList.find(item =>
      item.country === currCountry,
  );

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

const propTypes = {
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  onSave: PropTypes.func,

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
    this.getCurData = this.getCurData.bind(this);
  }
  onSave() {
    if (this.props.onSave) {
      this.props.onSave();
    }
  }
  getCurData(name) {
    return this.props.store.getIn(['data', name]);
  }
  render() {
    const { app, store, ...restProps } = this.props;
    const formData = store.getIn(['data']);
    const { getCurData } = this;
    const channelsOptions = getChannelsOptions('CN');
    const formOptions = fromJS([
      {
        id: 'enable',
        type: 'checkbox',
        value: '1',
        defaultValue: '0',
        text: _('Switch Radio'),
      }, {
        id: 'first5g',
        type: 'checkbox',
        value: '1',
        defaultValue: '0',
        text: _('Band Steering'),
      }, {
        id: 'switch11n',
        type: 'checkbox',
        value: '1',
        defaultValue: '0',
        text: _('11n Frist'),
      }, {
        id: 'countrycode',
        type: 'select',
        label: _('Country'),
        options: countryOptions,
      }, {
        id: 'channel',
        type: 'select',
        label: _('Channel'),
        options: channelsOptions,
      }, {
        id: 'channelwidth',
        type: 'select',
        label: _('Channel Bandwidth'),
        options: channelBandwidthOptions,
      }, {
        id: 'txpower',
        type: 'switch',
        label: _('Tx Power'),
        inputStyle: {
          display: 'block',
        },
        defaultValue: '100%',
        options: [
          {
            value: '3%',
            label: '3%',
          }, {
            value: '6%',
            label: '6%',
          }, {
            value: '12%',
            label: '12%',
          }, {
            value: '25%',
            label: '25%',
          }, {
            value: '50%',
            label: '50%',
          }, {
            value: '100%',
            label: '100%',
          },
        ],
      },
    ]);

    return (
      <FormContainer
        {...restProps}
        method="POST"
        data={formData}
        className="o-form o-form--compassed"
        options={formOptions}
        isSaving={app.get('saving')}
        onSave={this.onSave}
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
        hasSaveButton
      />
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
