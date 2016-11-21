import channels from 'shared/config/country.json';
import { fromJS, List } from 'immutable';

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

function getChannelsOptions(currCountry, bandwidth) {
  let i;
  let len;
  let channelsRange;
  const channelsOptions = [
    {
      value: 'auto',
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

  for (i; i <= len; i += 1) {
    channelsOptions.push({
      value: i,
      label: `${i}`,
    });
  }

  return fromJS(channelsOptions);
}

export const radioBase = fromJS([
  {
    // 射频开关
    id: 'enable',
    type: 'checkbox',
    form: 'radioBase',
    value: '1',
    defaultValue: '0',
    text: _('Switch Radio'),
  }, {
    id: 'first5g',
    form: 'radioBase',
    type: 'checkbox',
    value: '1',
    defaultValue: '0',
    text: _('Band Steering'),
  }, {
    id: 'switch11n',
    form: 'radioBase',
    type: 'checkbox',
    value: '1',
    defaultValue: '0',
    text: _('11n Frist'),
  }, {
    id: 'txpower',
    form: 'radioBase',
    type: 'select',
    label: _('Tx Power'),
    defaultValue: '100%',
    options: [
      {
        value: '3%',
        label: '3%',
      }, {
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
  }, {
    id: 'countrycode',
    form: 'radioBase',
    type: 'select',
    label: _('Country'),
    options: countryOptions,
  }, {
    id: 'channel',
    form: 'radioBase',
    type: 'select',
    label: _('Channel'),
    options:
      $$data => getChannelsOptions($$data.get('countrycode'))
    ,
  }, {
    id: 'channelwidth',
    form: 'radioBase',
    type: 'select',
    label: _('Channel Bandwidth'),
    options: channelBandwidthOptions,
  },
]);

export const radioAdvance = fromJS([
  {
    id: 'phymode',
    form: 'radioAdvance',
    label: _('Work Mode'),
    type: 'select',
    defaultValue: 'B/G/N',
    options: [
      {
        value: 'B/G/N',
        label: 'B/G/N',
      }, {
        value: 'B/G',
        label: 'B/G',
      }, {
        value: 'B/N',
        label: 'B/N',
      }, {
        value: '802.11N',
        label: '802.11N',
      }, {
        value: '802.11G',
        label: '802.11G',
      }, {
        value: '802.11B',
        label: '802.11B',
      }, {
        value: '802.11A',
        label: '802.11A',
      }, {
        value: '802.11N58',
        label: '802.11N58',
      },
    ],
  }, {
    id: 'maxclientcount',
    form: 'radioAdvance',
    type: 'number',
    min: 1,
    max: 999,
    defaultValue: 32,
    label: _('Max Clients'),
  }, {
    id: 'beaconinterval',
    form: 'radioAdvance',
    type: 'number',
    min: 1,
    max: 8191,
    defaultValue: 100,
    label: _('Beacon Interval'),
  }, {
    id: 'fragthreshold',
    form: 'radioAdvance',
    label: _('帧的分片门限值'),
    type: 'number',
    min: 256,
    max: 2346,
    defaultValue: 2346,
  }, {
    id: 'maxrxduration',
    form: 'radioAdvance',
    label: _('maxrxduration'),
    type: 'number',
    min: 1,
    max: 15,
    defaultValue: 4,
  }, {
    id: 'rtsthreshold',
    form: 'radioAdvance',
    label: _('RTS发送请求门限'),
    type: 'number',
    min: 0,
    max: 2346,
    defaultValue: 2346,
  }, {
    id: 'shortretrythreshold',
    form: 'radioAdvance',
    label: _('小于RTS门限最大重传次数'),
    type: 'number',
    min: 1,
    max: 15,
    defaultValue: 7,
  }, {
    id: 'longretrythreshold',
    form: 'radioAdvance',
    label: _('大于RTS门限最大重传次数'),
    type: 'number',
    min: 1,
    max: 15,
    defaultValue: 4,
  }, {
    id: 'dtim',
    form: 'radioAdvance',
    label: _('信标帧间隔的数量'),
    type: 'number',
    min: 1,
    max: 15,
    defaultValue: 7,
  }, {
    id: 'wmmenable',
    form: 'radioAdvance',
    label: _('wmm开关'),
    type: 'checkbox',
    value: '1',
    defaultValue: '0',
  }, {
    id: 'cwmin',
    form: 'radioAdvance',
    label: _('wmm竞争窗口值的最小时间'),
    type: 'number',
    min: 1,
    max: 3600,
    defaultValue: 60,
  }, {
    id: 'cwmax',
    form: 'radioAdvance',
    label: _('wmm竞争窗口值的最大时间'),
    type: 'number',
    min: 1,
    max: 3600,
    defaultValue: 60,
  }, {
    id: 'aifs',
    form: 'radioAdvance',
    label: _('wmm任意内部数据帧间隙'),
    type: 'number',
    min: 1,
    max: 3600,
    defaultValue: 60,
  }, {
    id: 'txop',
    form: 'radioAdvance',
    label: _('txop'),
    type: 'number',
    min: 1,
    max: 3600,
    defaultValue: 60,
  }, {
    id: 'admctrmandatory',
    form: 'radioAdvance',
    label: _('admctrmandatory'),
    type: 'number',
    min: 1,
    max: 3600,
    defaultValue: 60,
  }, {
    id: 'spatialstreams',
    form: 'radioAdvance',
    label: _('空间流'),
    type: 'switch',
    inputStyle: {
      width: '100%',
    },
    options: [
      {
        value: '0',
        label: _('Custom'),
      }, {
        value: '1x1',
        label: '1x1',
      }, {
        value: '2x2',
        label: '2x2',
      }, {
        value: '3x3',
        label: '3x3',
      }, {
        value: '4x4',
        label: '4x4',
      },
    ],
    value: '1',
    defaultValue: '1',
  }, {
    id: 'txchain',
    form: 'radioAdvance',
    label: _('自定义发射空间流'),
    type: 'text',
    maxLength: 32,
    defaultValue: '',
    required: true,
    showPrecondition(data) {
      return data.get('spatialstreams') === '0';
    },
  }, {
    id: 'rxchain',
    form: 'radioAdvance',
    label: _('自定义接收空间流'),
    type: 'text',
    maxLength: 32,
    defaultValue: '',
    showPrecondition(data) {
      return data.get('spatialstreams') === '0';
    },
  }, {
    id: 'shortgi',
    form: 'radioAdvance',
    label: _('shortgi'),
    type: 'checkbox',
    value: '1',
    defaultValue: '1',
  }, {
    id: 'preamble',
    form: 'radioAdvance',
    label: _('preamble'),
    type: 'switch',
    inputStyle: {
      width: '100%',
    },
    options: [
      {
        value: '1',
        label: _('Short'),
      }, {
        value: '0',
        label: _('Long'),
      },
    ],
    defaultValue: '1',
    showPrecondition(data) {
      return data.get('shortgi') === '1';
    },
  }, {
    id: 'ampdu',
    form: 'radioAdvance',
    label: _('ampdu'),
    type: 'checkbox',
    value: '1',
    defaultValue: '0',
  }, {
    id: 'amsdu',
    form: 'radioAdvance',
    label: _('amsdu'),
    type: 'checkbox',
    value: '1',
    defaultValue: '0',
  }, {
    id: 'rateset',
    form: 'radioAdvance',
    label: _('速率集'),
    type: 'text',
    maxLength: '32',
    defaultValue: '',
  },
]);
