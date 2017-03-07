import channels from 'shared/config/country.json';
import { fromJS, List } from 'immutable';

const $$bandwidthOptions = fromJS([
  {
    value: 20,
    label: 'HT20',
  }, {
    value: 30,
    label: 'HT40-',
  }, {
    value: 50,
    label: 'HT40+',
  }, {
    value: 80,
    label: 'HT80',
  },
]);
const channelsList = List(channels);

const spatialstreamsOptions = [
  {
    value: '1',
    label: '1x1',
  }, {
    value: '2',
    label: '2x2',
  }, {
    value: '3',
    label: '3x3',
  }, {
    value: '4',
    label: '4x4',
  },
];

export const countryOptions = channelsList.map(item =>
  ({
    value: item.country,
    label: b28n.getLang() === 'cn' ? _(item.cn) : _(item.en),
  }),
).toJS();
export const $$phymodeOptopns = fromJS([
  {
    value: 1,
    label: '802.11b',
  }, {
    value: 2,
    label: '802.11g',
  }, {
    value: 4,
    label: '802.11n',
  }, {
    value: 3,
    label: '802.11bg',
  }, {
    value: 7,
    label: '802.11bgn',
  }, {
    value: 8,
    label: '802.11a',
  }, {
    value: 12,
    label: '802.11na',
  }, {
    value: 16,
    label: '802.11ac',
  },
]);

export const $$qosTypeOptopns = fromJS([
  {
    value: 0,
    label: _('Default Optimization'),
  }, {
    value: 1,
    label: _('Optimized for Throughput'),
  }, {
    value: 2,
    label: _('Optimized for Capacity'),
  }, {
    value: 3,
    label: _('Manual Configuration'),
  },
]);

export const numberKeys = [
  'groupid',
  'radioenable',
  'terminalRelease',
  'terminalReleaseVal',
  'beaconinterval',
  'fragthreshold',
  'longretrythreshold',
  'maxrxduration',
  'rtsthreshold',
  'shortretrythreshold',
  'maxclientcount',
  'dtim',
  'wmmenable',
  'cwmin',
  'cwmax',
  'aifs',
  'txop',
  'admctrmandatory',
  'phymode',
  'shortgi',
  'preamble',
  'ampdu',
  'amsdu',
  'channelwidth',
  'channel',
  'spatialstreams',
  'switch11n',
  'first5g',
];

export const radioBase = fromJS([
  {
    // 射频开关
    id: 'radioenable',
    type: 'checkbox',
    form: 'radioBase',
    value: '1',
    defaultValue: '0',
    text: _('RF Switch'),
    label: _('RF Switch'),
    showLabel: false,
  },
  {
    id: 'phymode',
    form: 'radioBase',
    label: _('Physical Mode'),
    type: 'select',
    defaultValue: '',
    options: $$phymodeOptopns,
    required: true,
  },
  // {
  //   id: 'switch11n',
  //   form: 'radioBase',
  //   type: 'checkbox',
  //   value: '1',
  //   defaultValue: '0',
  //   text: _('11n Frist'),
  //   showPrecondition(data) {
  //     return parseInt(data.get('phymode'), 10) > 8;
  //   },
  // },
  {
    id: 'txpower',
    form: 'radioBase',
    type: 'select',
    label: _('Tx Power'),
    defaultValue: '100%',
    required: true,
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
  {
    id: 'countrycode',
    form: 'radioBase',
    type: 'select',
    label: _('Country'),
    defaultValue: '',
    required: true,
    options: countryOptions,
    disabled: true,
  },
  {
    id: 'channel',
    form: 'radioBase',
    type: 'select',
    label: _('Channel'),
    defaultValue: '',
    required: true,
    options: [],
  },
  {
    id: 'channelwidth',
    form: 'radioBase',
    type: 'switch',
    label: _('Channel Bandwidth'),
    defaultValue: '',
    required: true,
    inputStyle: {
      display: 'block',
    },
    options($$data) {
      const phymode = $$data.get('phymode');
      const ret = [];

      switch (phymode) {
        case 4:
        case 7:
        case 12:
          return $$bandwidthOptions.delete(-1);

        case 16:
          return $$bandwidthOptions;

        default:
      }

      return ret;
    },
    showPrecondition(data) {
      const showArr = '4,7,12,16'.split(',');
      const phymode = `${data.get('phymode')}`;

      return showArr.indexOf(phymode) !== -1;
    },
  },
]);

export const radioAdvance = fromJS([
  // {
  //   id: 'first5g',
  //   form: 'radioBase',
  //   type: 'checkbox',
  //   value: '1',
  //   defaultValue: '0',
  //   label: _('Band Steering'),
  // },
  {
    id: 'txchain',
    form: 'radioAdvance',
    label: _('Custom Spatial Stream'),
    type: 'switch',
    defaultValue: '1x1',
    required: true,
    options: spatialstreamsOptions,
    showPrecondition(data) {
      return parseInt(data.get('spatialstreams'), 10) !== 1;
    },
  },
  // {
  //   id: 'rxchain',
  //   form: 'radioAdvance',
  //   label: _('RX Spatial Stream'),
  //   type: 'switch',
  //   defaultValue: '1x1',
  //   required: true,
  //   noForm: true,
  //   options: spatialstreamsOptions,
  //   showPrecondition(data) {
  //     return parseInt(data.get('spatialstreams'), 10) !== 1;
  //   },
  // },
  {
    id: 'wmmenable',
    form: 'radioAdvance',
    label: _('WMM Switch'),
    type: 'checkbox',
    value: '1',
    defaultValue: '0',
  },
  // {
  //   id: 'maxclientcount',
  //   form: 'radioAdvance',
  //   type: 'number',
  //   min: 1,
  //   max: 999,
  //   defaultValue: 32,
  //   label: _('Max Clients'),
  // },
  {
    id: 'beaconinterval',
    form: 'radioAdvance',
    type: 'number',
    min: 32,
    max: 8191,
    defaultValue: 100,
    help: _('ms'),
    label: _('Beacon Interval'),
  }, {
    id: 'fragthreshold',
    form: 'radioAdvance',
    label: _('Frame Fragment Threshold'),
    type: 'number',
    min: 256,
    max: 2346,
    defaultValue: 2346,
  },
  // {
  //   id: 'maxrxduration',
  //   form: 'radioAdvance',
  //   label: _('Max RX Duration'),
  //   type: 'number',
  //   min: 500,
  //   max: 250000,
  // },
  {
    id: 'rtsthreshold',
    form: 'radioAdvance',
    label: _('RTS Threshold'),
    type: 'number',
    min: 0,
    max: 2346,
    defaultValue: 2346,
  },
  // {
  //   id: 'shortretrythreshold',
  //   form: 'radioAdvance',
  //   label: _('Max Resend Times'),
  //   help: _('Under RTS Threshold'),
  //   type: 'number',
  //   min: 1,
  //   max: 15,
  //   defaultValue: 7,
  // }, {
  //   id: 'longretrythreshold',
  //   form: 'radioAdvance',
  //   label: _('Max Resend Times'),
  //   help: _('Beyond RTS Threshold'),
  //   type: 'number',
  //   min: 1,
  //   max: 15,
  //   defaultValue: 4,
  // },
  {
    id: 'dtim',
    form: 'radioAdvance',
    label: _('DTIM'),
    type: 'number',
    min: 1,
    max: 15,
    defaultValue: 7,
  },
  // {
  //   id: 'cwmin',
  //   form: 'radioAdvance',
  //   label: _('CW Threshold Min Time'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // }, {
  //   id: 'cwmax',
  //   form: 'radioAdvance',
  //   label: _('CW Threshold Max Time'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // }, {
  //   id: 'aifs',
  //   form: 'radioAdvance',
  //   label: _('WMM Random Internal Data Frame Interval'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // },
  // {
  //   id: 'txop',
  //   form: 'radioAdvance',
  //   label: _('txop'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // }, {
  //   id: 'admctrmandatory',
  //   form: 'radioAdvance',
  //   label: _('admctrmandatory'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // },
  // {
  //   id: 'shortgi',
  //   form: 'radioAdvance',
  //   label: _('Short GI'),
  //   type: 'checkbox',
  //   value: '1',
  //   defaultValue: '1',
  //   showPrecondition(data) {
  //     return parseInt(data.get('phymode'), 10) >= 8;
  //   },
  // },
  // {
  //   id: 'preamble',
  //   form: 'radioAdvance',
  //   label: _('Preamble'),
  //   type: 'switch',
  //   inputStyle: {
  //     width: '100%',
  //   },
  //   options: [
  //     {
  //       value: 1,
  //       label: _('Short'),
  //     }, {
  //       value: 0,
  //       label: _('Long'),
  //     },
  //   ],
  //   defaultValue: '1',
  //   showPrecondition(data) {
  //     return parseInt(data.get('phymode'), 10) === 8 &&
  //         parseInt(data.get('shortgi'), 10) === 1;
  //   },
  // },
  // {
  //   id: 'ampdu',
  //   form: 'radioAdvance',
  //   label: _('AMPDU'),
  //   type: 'checkbox',
  //   value: '1',
  //   defaultValue: '0',
  //   showPrecondition(data) {
  //     return parseInt(data.get('phymode'), 10) >= 8;
  //   },
  // }, {
  //   id: 'amsdu',
  //   form: 'radioAdvance',
  //   label: _('AMSDU'),
  //   type: 'checkbox',
  //   value: '1',
  //   defaultValue: '0',
  //   showPrecondition(data) {
  //     return parseInt(data.get('phymode'), 10) >= 8;
  //   },
  // },
  {
    id: 'rateset',
    form: 'radioAdvance',
    label: _('Rate Set'),
    type: 'checkboxs',
    maxLength: '31',
    defaultValue: '',
    options: [
      {
        value: 'MCS0',
        label: 'MCS0',
      }, {
        value: 'MCS1',
        label: 'MCS1',
      }, {
        value: 'MCS2',
        label: 'MCS2',
      }, {
        value: 'MCS3',
        label: 'MCS3',
      }, {
        value: 'MCS4',
        label: 'MCS4',
      }, {
        value: 'MCS5',
        label: 'MCS5',
      }, {
        value: 'MCS6',
        label: 'MCS6',
      }, {
        value: 'MCS7',
        label: 'MCS7',
      },
      {
        value: 'MCS8',
        label: 'MCS8',
      }, {
        value: 'MCS9',
        label: 'MCS9',
      },
    ],
  },
]);

export const radioQos = fromJS([
  {
    id: 'wmmtemplate',
    form: 'radioQos',
    label: _('性能优化模式'),
    type: 'select',
    defaultValue: '',
    options: $$qosTypeOptopns,
    required: true,
  }, {
    id: 'list',
    type: 'list',
    list: [
      {
        id: 'name',
        label: _('Name'),
        options: [
          {
            value: '0',
            label: _('BestEffort(BE)'),
          }, {
            value: '1',
            label: _('Background(BK)'),
          }, {
            value: '2',
            label: _('Video(VI)'),
          }, {
            value: '3',
            label: _('Video(VI)'),
          }, {
            value: '4',
            label: _('Messages Auth'),
          }, {
            value: '5',
            label: _('Wechat Auth'),
          }, {
            value: '6',
            label: _('Public Platform Auth'),
          }, {
            value: '7',
            label: _('Visitor Auth'),
          },
        ],
        noForm: true,
      },
      {
        id: 'basip',
        label: _('CWMIN'),
        min: '0',
        max: '15',
        type: 'text',
      }, {
        id: 'username',
        label: _('CWMAX'),
        min: '0',
        max: '15',
        type: 'text',
      }, {
        id: 'sessiontime',
        label: _('AIFS'),
        min: '0',
        max: '15',
        type: 'text',
      }, {
        id: 'basid',
        label: _('TXOP'),
        width: '80',
        min: '0',
        max: '15',
        type: 'text',
      }, {
        id: 'enable',
        label: _('NOACK'),
        type: 'checkbox',
        display: 'block',
      },
    ],
  },
]);
