import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

// components
import {
  Table, EchartReact, Button,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';

const tableOptions = fromJS([
  {
    id: 'mac',
    text: _('Attacker MAC'),
    transform(val, item) {
      return val || item.get('macaddress');
    },
  }, {
    id: 'attackType',
    text: _('Attack Type'),
  }, {
    id: 'attackTime',
    text: _('Attack Time'),
  }, {
    id: 'attackDetails',
    text: _('Attack Details'),
  }, {
    id: 'protectionMeasures',
    text: _('Protection Measures'),
    width: '160',
  }, {
    id: 'jumpSecurityEvents',
    text: _('Jump Security Events'),
    width: '160',
  },
]);

function getSafeTypeChartOtion(attackTypeMap) {
  let safeTypeList = fromJS(
    [{
      value: 0,
      name: 's',
    }]
  );
  let totalNum = 0;

  const apOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
    },
    title: {
      text: _('Attack Type Diagram'),
      x: 'center',
    },
    series: [
      {
        name: _('Status'),
        type: 'pie',
        radius: ['10%', '45%'],
        center: ['50%', '58%'],

        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

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

  apOption.title.subtext = _('Attack Number: ') + totalNum;

  apOption.series[0].data = safeTypeList.toArray();

  return apOption;
}

const propTypes = {
  screens: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  initScreen: PropTypes.func,
  leaveScreen: PropTypes.func,
  fetchScreenData: PropTypes.func,

};
const defaultProps = {};

// 原生的 react 页面
export default class View extends React.Component {
  constructor(props) {
    super(props);
    props.initScreen({
      id: props.route.id,
      formUrl: props.route.formUrl,
      path: props.route.path,
      isFetchInfinite: true,
      fetchIntervalTime: 5000,
    });
  }

  componentWillMount() {
    this.props.fetchScreenData();
  }

  componentWillUnmount() {
    this.props.leaveScreen();
  }
  render() {
    const { screens } = this.props;
    const curScreenId = screens.get('curScreenId');
    const serverList = screens.getIn([curScreenId, 'data', 'list']);
    const attackTypeMap = screens.getIn([curScreenId, 'data', 'attackType']);
    const safeTypeChartOtion = getSafeTypeChartOtion(attackTypeMap);

    return (
      <div className="Stats">
        <h2>{ _('Safe Status') }</h2>
        <div className="stats-group clearfix" >
          <div className="stats-group-large" >
            <div className="stats-group-cell">
              <h3>{ _('Attack Type') }</h3>
            </div>
            <div className="stats-group-cell">
              <EchartReact
                option={safeTypeChartOtion}
                className="stats-group-canvas"
                style={{
                  width: '100%',
                }}
              />
            </div>
          </div>
          <div className="stats-group-large">
            <div className="stats-group-cell">
              <h3>
                { _('List Of Recent Security Incidents') }
                <Button
                  icon="download"
                  theme="primary"
                  text={_('Export Report')}
                  style={{
                    marginLeft: '12px',
                  }}
                />
              </h3>
            </div>
            <div className="stats-group-cell">
              <Table
                className="table"
                options={tableOptions}
                list={serverList}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    screens: state.screens,
    groupid: state.product.getIn(['group', 'selected', 'id']),
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  screenActions
)(View);
