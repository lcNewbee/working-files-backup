import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import AppScreen from 'shared/components/Template/AppScreen';

// components
import {
  Table, EchartReact, Button,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';

const colors = [
  '#f6402b', '#ff9801', '#ffc100',
  '#91d951', '#1fb5ac', '#73d6d1',
  '#00a7f6', '#1193f5', '#3e4cb7',
  '#6834bc', '#9c1ab2', '#eb1461',
];
const $$commonPieOption = fromJS({
  color: colors,
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  title: {
    x: '29%',
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
    x: '54%',
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

const tableOptions = fromJS([
  {
    id: 'attackmac',
    text: _('Attacker MAC'),
    transform(val, item) {
      return val || item.get('macaddress');
    },
  }, {
    id: 'type',
    text: _('Attack Type'),
  }, {
    id: 'time',
    text: _('Attack Time'),
  }, {
    id: 'info',
    text: _('Attack Details'),
  }, {
    id: 'protect',
    text: _('Protection Measures'),
    width: '160',
  }, {
    id: 'jump',
    text: _('Jump to Security Events'),
    width: '160',
  },
]);

function getSafeTypeChartOtion(attackTypeMap) {
  let safeTypeList = fromJS(
    [{
      value: 0,
      name: 's',
    }],
  );
  let totalNum = 0;

  const apOption = $$commonPieOption.mergeDeep({
    title: {
      text: _('Attack Number'),
    },
    series: [
      {
        name: _('Status'),
        type: 'pie',
      },
    ],
  }).toJS();

  if (attackTypeMap) {
    safeTypeList = attackTypeMap
      .map((val, key) => ({
        value: val,
        name: _(key),
      }))
      .toList()
      .sort((prev, next) => prev.value <= next.value);
  }
  apOption.legend.data = safeTypeList
      .map((item) => {
        totalNum += item.value;
        return item.name;
      })
      .toArray();

  apOption.title.subtext = totalNum;

  apOption.series[0].data = safeTypeList.toArray();

  return apOption;
}

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};

// 原生的 react 页面
export default class SafeStatus extends React.Component {
  render() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const serverList = store.getIn([curScreenId, 'data', 'list']);
    const attackTypeMap = store.getIn([curScreenId, 'data', 'attackType']);
    const safeTypeChartOtion = getSafeTypeChartOtion(attackTypeMap);

    return (
      <AppScreen
        {...this.props}
      >
        <div className="t-overview o-box--light">
          <div className="t-overview__section" >
            <div className="element">
              <h3>{ _('Attack Type') }</h3>
            </div>
            <div className="element">
              <EchartReact
                option={safeTypeChartOtion}
                className="stats-group-canvas"
                style={{
                  width: '100%',
                  height: '200px',
                }}
              />
            </div>
          </div>
          <div className="element t-overview__header">
            <h3>
              { _('List Of Recent Security Incidents') }
              {
              /*
                <Button
                  icon="download"
                  theme="primary"
                  text={_('Export Report')}
                  style={{
                    marginLeft: '12px',
                  }}
                />
              */
              }
            </h3>
          </div>
          <div className="element t-overview__section">
            <Table
              className="table table--light"
              options={tableOptions}
              list={serverList}
            />
          </div>
        </div>
      </AppScreen>
    );
  }
}

SafeStatus.propTypes = propTypes;
SafeStatus.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
    groupid: state.product.getIn(['group', 'selected', 'id']),
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  screenActions,
)(SafeStatus);
