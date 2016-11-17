import React from 'react';
import { fromJS } from 'immutable';
import { EchartReact } from 'shared/components';


export default class Antenna extends React.Component {
  render() {
    const yAxisData = fromJS(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    const echartOption = {
      title: {
        text: _('Antenna Adjust'),
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Antenna 1', 'Antenna 2'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        min: -100,
        max: -10,
        onZero: false,
        interval: 10,
      },
      yAxis: {
        type: 'category',
        data: yAxisData.toJS(),
        onZero: false,
      },
      series: [
        {
          name: 'Antenna 1',
          type: 'bar',
          data: [-70, -69, -42, -54, -54, -54, -54, -70, -70, -70, -70],
        },
        {
          name: 'Antenna 2',
          type: 'bar',
          data: [-80, -70, -70, -70, -70, -70, -70, -70, -70, -70, -70],
        },
      ],
    };
    return (
      <EchartReact
        option={echartOption}
        style={{
          width: '600px',
          height: '600px',
        }}
      />
    );
  }
}
