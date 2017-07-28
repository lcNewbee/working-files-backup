import channels from 'shared/config/country.json';
import {
  fromJS,
  List,
} from 'immutable';

const $$bandwidthOptions = fromJS([{
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
}]);

const channelsList = List(channels);

const spatialstreamsOptions = [{
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
}];

export const countryOptions = channelsList.map(item =>
  ({
    value: item.country,
    label: b28n.getLang() === 'cn' ? __(item.cn) : __(item.en),
  }),
).toJS();
export const $$phymodeOptopns = fromJS([{
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
}]);

export const $$qosTypeOptopns = fromJS([{
  value: 0,
  label: __('Default Optimization'),
}, {
  value: 1,
  label: __('Optimized for Throughput'),
}, {
  value: 2,
  label: __('Optimized for Capacity'),
}, {
  value: 3,
  label: __('Manual Configuration'),
}]);

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
    text: __('RF Switch'),
    label: __('RF Switch'),
    showLabel: false,
  },
  {
    id: 'phymode',
    form: 'radioBase',
    label: __('Physical Mode'),
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
  //   text: __('11n Frist'),
  //   visible(data) {
  //     return parseInt(data.get('phymode'), 10) > 8;
  //   },
  // },
  {
    id: 'txpower',
    form: 'radioBase',
    type: 'select',
    label: __('Tx Power'),
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
  // {
  //   id: 'countrycode',
  //   form: 'radioBase',
  //   type: 'select',
  //   label: __('Country'),
  //   defaultValue: '',
  //   required: true,
  //   options: countryOptions,
  //   disabled: true,
  // },
  {
    id: 'channel',
    form: 'radioBase',
    type: 'select',
    label: __('Channel'),
    defaultValue: '',
    required: true,
    options: [],
  },
  {
    id: 'channelwidth',
    form: 'radioBase',
    type: 'switch',
    label: __('Channel Bandwidth'),
    defaultValue: '',
    required: true,
    inputStyle: {
      display: 'block',
    },
    options($$data) {
      const phymode = $$data.get('phymode');
      const ret = $$bandwidthOptions;

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
    visible(data) {
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
  //   label: __('Band Steering'),
  // },
  {
    id: 'txchain',
    form: 'radioAdvance',
    label: __('Custom Spatial Stream'),
    type: 'switch',
    defaultValue: '1x1',
    required: true,
    options: spatialstreamsOptions,
    visible(data) {
      return parseInt(data.get('spatialstreams'), 10) !== 1;
    },
  },
  // {
  //   id: 'rxchain',
  //   form: 'radioAdvance',
  //   label: __('RX Spatial Stream'),
  //   type: 'switch',
  //   defaultValue: '1x1',
  //   required: true,
  //   noForm: true,
  //   options: spatialstreamsOptions,
  //   visible(data) {
  //     return parseInt(data.get('spatialstreams'), 10) !== 1;
  //   },
  // },
  // {
  //   id: 'wmmenable',
  //   form: 'radioAdvance',
  //   label: __('WMM Switch'),
  //   type: 'checkbox',
  //   value: '1',
  //   defaultValue: '0',
  // },
  // {
  //   id: 'maxclientcount',
  //   form: 'radioAdvance',
  //   type: 'number',
  //   min: 1,
  //   max: 999,
  //   defaultValue: 32,
  //   label: __('Max Clients'),
  // },
  {
    id: 'beaconinterval',
    form: 'radioAdvance',
    type: 'number',
    min: 32,
    max: 8191,
    defaultValue: 100,
    help: __('ms'),
    label: __('Beacon Interval'),
  }, {
    id: 'fragthreshold',
    form: 'radioAdvance',
    label: __('Frame Fragment Threshold'),
    type: 'number',
    min: 256,
    max: 2346,
    defaultValue: 2346,
  },
  // {
  //   id: 'maxrxduration',
  //   form: 'radioAdvance',
  //   label: __('Max RX Duration'),
  //   type: 'number',
  //   min: 500,
  //   max: 250000,
  // },
  {
    id: 'rtsthreshold',
    form: 'radioAdvance',
    label: __('RTS Threshold'),
    type: 'number',
    min: 0,
    max: 2346,
    defaultValue: 2346,
  },
  // {
  //   id: 'shortretrythreshold',
  //   form: 'radioAdvance',
  //   label: __('Max Resend Times'),
  //   help: __('Under RTS Threshold'),
  //   type: 'number',
  //   min: 1,
  //   max: 15,
  //   defaultValue: 7,
  // }, {
  //   id: 'longretrythreshold',
  //   form: 'radioAdvance',
  //   label: __('Max Resend Times'),
  //   help: __('Beyond RTS Threshold'),
  //   type: 'number',
  //   min: 1,
  //   max: 15,
  //   defaultValue: 4,
  // },
  {
    id: 'dtim',
    form: 'radioAdvance',
    label: __('DTIM'),
    type: 'number',
    min: 1,
    max: 15,
    defaultValue: 7,
  },
  // {
  //   id: 'cwmin',
  //   form: 'radioAdvance',
  //   label: __('CW Threshold Min Time'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // }, {
  //   id: 'cwmax',
  //   form: 'radioAdvance',
  //   label: __('CW Threshold Max Time'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // }, {
  //   id: 'aifs',
  //   form: 'radioAdvance',
  //   label: __('WMM Random Internal Data Frame Interval'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // },
  // {
  //   id: 'txop',
  //   form: 'radioAdvance',
  //   label: __('txop'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // }, {
  //   id: 'admctrmandatory',
  //   form: 'radioAdvance',
  //   label: __('admctrmandatory'),
  //   type: 'number',
  //   min: 1,
  //   max: 3600,
  //   defaultValue: 60,
  // },
  // {
  //   id: 'shortgi',
  //   form: 'radioAdvance',
  //   label: __('Short GI'),
  //   type: 'checkbox',
  //   value: '1',
  //   defaultValue: '1',
  //   visible(data) {
  //     return parseInt(data.get('phymode'), 10) >= 8;
  //   },
  // },
  // {
  //   id: 'preamble',
  //   form: 'radioAdvance',
  //   label: __('Preamble'),
  //   type: 'switch',
  //   inputStyle: {
  //     width: '100%',
  //   },
  //   options: [
  //     {
  //       value: 1,
  //       label: __('Short'),
  //     }, {
  //       value: 0,
  //       label: __('Long'),
  //     },
  //   ],
  //   defaultValue: '1',
  //   visible(data) {
  //     return parseInt(data.get('phymode'), 10) === 8 &&
  //         parseInt(data.get('shortgi'), 10) === 1;
  //   },
  // },
  // {
  //   id: 'ampdu',
  //   form: 'radioAdvance',
  //   label: __('AMPDU'),
  //   type: 'checkbox',
  //   value: '1',
  //   defaultValue: '0',
  //   visible(data) {
  //     return parseInt(data.get('phymode'), 10) >= 8;
  //   },
  // }, {
  //   id: 'amsdu',
  //   form: 'radioAdvance',
  //   label: __('AMSDU'),
  //   type: 'checkbox',
  //   value: '1',
  //   defaultValue: '0',
  //   visible(data) {
  //     return parseInt(data.get('phymode'), 10) >= 8;
  //   },
  // },
  {
    id: 'rateset',
    form: 'radioAdvance',
    label: __('Rate Set'),
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
      }, {
        value: 'MCS8',
        label: 'MCS8',
      }, {
        value: 'MCS9',
        label: 'MCS9',
      },
    ],
  },
]);

export const radioQos = fromJS([{
  id: 'wmmtemplate',
  form: 'radioAdvance',
  label: __('QoS Optimization Mode'),
  type: 'select',
  defaultValue: '',
  options: $$qosTypeOptopns,
  required: true,
}, {
  id: 'add',
  type: 'table',
  title: __('WMM Parameters'),
  thead: [
    __('Name'),
    __('CWMIN'),
    __('CWMAX'),
    __('AIFS'),
    __('TXOP'),
    __('NOACK'),
  ],
  visible($$data) {
    return $$data.get('wmmtemplate') === 3;
  },
  list: [
    [
      {
        text: __(''),
        noForm: true,
      },
      {
        text: __('0-15'),
        noForm: true,
      }, {
        text: __('0-15'),
        noForm: true,
      }, {
        text: __('0-15'),
        noForm: true,
      }, {
        text: __('0-8192'),
        noForm: true,
      }, {
        text: __(''),
        noForm: true,
      },
    ],
    [
      {
        id: 'name',
        form: 'radioAdvance',
        text: __('BestEffort'),
        noForm: true,
      },
      {
        id: 'be_cwmin',
        form: 'radioAdvance',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'be_cwmax',
        form: 'radioAdvance',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'be_aifs',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'be_txop',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '8192',
        type: 'number',
      }, {
        id: 'be_noack',
        form: 'radioQos',
        dataType: 'number',
        type: 'checkbox',
      },
    ],
    [
      {
        id: 'name',
        text: __('Background'),
        noForm: true,
      },
      {
        id: 'bk_cwmin',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'bk_cwmax',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'bk_aifs',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'bk_txop',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '8192',
        type: 'number',
      }, {
        id: 'bk_noack',
        type: 'checkbox',
        dataType: 'number',
      },
    ],
    [
      {
        id: 'name',
        text: __('Video(VI)'),
        noForm: true,
      },
      {
        id: 'vi_cwmin',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'vi_cwmax',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'vi_aifs',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'vi_txop',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '8192',
        type: 'number',
      }, {
        id: 'vi_noack',
        form: 'radioQos',
        dataType: 'number',
        type: 'checkbox',
      },
    ],
    [
      {
        id: 'name',
        text: __('Voice(VO)'),
        noForm: true,
      },
      {
        id: 'vo_cwmin',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'vo_cwmax',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'vo_aifs',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '15',
        type: 'number',
      }, {
        id: 'vo_txop',
        form: 'radioQos',
        dataType: 'number',
        required: true,
        min: '0',
        max: '8192',
        type: 'number',
      }, {
        id: 'vo_noack',
        form: 'radioQos',
        dataType: 'number',
        type: 'checkbox',
      },
    ],
  ],
}]);
