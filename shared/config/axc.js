import { fromJS } from 'immutable';

export const PURVIEW_ADMIN = 'All';
export const PURVIEW_GUEST = 'Read-only';

export const purviewOptions = [
  {
    value: '1',
    module: 'network',
    label: _('Network '),
  }, {
    value: '2',
    module: 'group',
    label: _('AP Groups '),
  }, {
    value: '3',
    module: 'system',
    label: _('System '),
  },
  {
    value: '4',
    module: 'portal',
    label: _('Hotspot'),
  },
];

export const colors = [
  '#00a7f6', '#f6402b', '#ff9801', '#ffc100',
  '#91d951', '#1fb5ac', '#73d6d1',
  '#00a7f6', '#1193f5', '#3e4cb7',
  '#6834bc', '#9c1ab2', '#eb1461',
];

export const $$commonPieOption = fromJS({
  color: colors,
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  title: {
    x: '29.2%',
    y: '39%',
    textAlign: 'center',
    textStyle: {
      fontSize: '14',
      color: '#0093dd',
    },
    subtextStyle: {
      fontSize: '18',
      fontWeight: 'bolder',
      color: '#000',
    },
  },
  legend: {
    orient: 'vertical',
    x: '56%',
    y: 'center',
    itemWidth: 12,
    itemHeight: 12,
  },
  series: [
    {
      type: 'pie',
      center: ['30%', '50%'],
      radius: ['60%', '86%'],
      avoidLabelOverlap: false,
      label: {
        formatter: '{b}: {c}',
        normal: {
          show: false,
          //position: 'center',
        },
        emphasis: {
          show: false,
          textStyle: {
            fontSize: '12',
            fontWeight: 'bold',
          },
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
    },
  ],
});

export default {};
