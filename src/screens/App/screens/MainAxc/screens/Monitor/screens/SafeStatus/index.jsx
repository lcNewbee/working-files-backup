import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import AppScreen from 'shared/components/Template/AppScreen';
import { $$commonPieOption } from 'shared/config/axc';

// components
import {
  Table, EchartReact, Button,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';


const tableOptions = fromJS([
  {
    id: 'attackmac',
    text: __('Attacker MAC'),
    transform(val, item) {
      return val || item.get('macaddress');
    },
  }, {
    id: 'type',
    text: __('Attack Type'),
  }, {
    id: 'time',
    text: __('Attack Time'),
  }, {
    id: 'info',
    text: __('Attack Details'),
  }, {
    id: 'protect',
    text: __('Protection Measures'),
    width: '160',
  }, {
    id: 'jump',
    text: __('Jump to Security Events'),
    width: '160',
  },
]);

function getSafeTypeChartOtion(attackTypeMap) {
  let $$safeTypeList = fromJS(
    [{
      value: 0,
      name: '',
    }],
  );
  let totalNum = 0;
  let apOption = {};

  if (!attackTypeMap) {
    return apOption;
  }

  apOption = $$commonPieOption.mergeDeep({
    title: {
      x: '29.5%',
      text: __('Attack Number'),
    },
    legend: {
      formatter: (name) => {
        const num = attackTypeMap.get(name) || 0;

        return `${name}: ${num}`;
      },
    },
    series: [
      {
        name: __('Status'),
        type: 'pie',
      },
    ],
  }).toJS();

  if (attackTypeMap) {
    $$safeTypeList = attackTypeMap
      .map((val, key) => ({
        value: val,
        name: __(key),
      }))
      .toList()
      .sort((prev, next) => prev.value <= next.value);
  }
  apOption.legend.data = $$safeTypeList
      .map((item) => {
        totalNum += item.value;
        return item.name;
      })
      .toArray();

  apOption.title.subtext = `${totalNum || 0}`;

  apOption.series[0].data = $$safeTypeList.toArray();

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
              <h3>{ __('Attack Type') }</h3>
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
              { __('List Of Recent Security Incidents') }
              {
              /*
                <Button
                  icon="download"
                  theme="primary"
                  text={__('Export Report')}
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
