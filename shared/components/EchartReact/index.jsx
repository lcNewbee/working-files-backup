import React, { PropTypes } from 'react';
import echarts from 'echarts/lib/echarts';

/**
 * echarts图标按需引入
 */
// 引入柱状图
require('echarts/lib/chart/bar');

// 引入折线图
require('echarts/lib/chart/line');
require('echarts/lib/chart/lines');

// 引入折饼图
require('echarts/lib/chart/pie');

// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/component/title');

const propTypes = {
  option: PropTypes.object,
  onEvents: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
  theme: PropTypes.string,
  onChartReady: PropTypes.func,
  showLoading: PropTypes.bool,
};

const defaultProps = {
  Component: 'span',
};

class ReactEchart extends React.Component {
  constructor(props) {
    super(props);

    this.renderEchartDom = this.renderEchartDom.bind(this);
    this.getEchartsInstance = this.getEchartsInstance.bind(this);
  }

  // first add
  componentDidMount() {
    const { onEvents } = this.props;
    const echartObj = this.renderEchartDom();

    if (onEvents) {
      Object.keys(onEvents).forEach((eventFunc, eventName) => {
        if (typeof eventFunc === 'function') {
          echartObj.on(eventName, (param) => eventFunc(param, echartObj));
        }
      });
    }

    // on chart ready
    if (typeof this.props.onChartReady === 'function') {
      this.props.onChartReady(echartObj);
    }
  }

  // cache size
  componentWillUpdate() {
    this.offsetWidth = this.myRef.offsetWidth;
    this.offsetHeight = this.myRef.offsetHeight;
  }

  // update
  componentDidUpdate() {
    this.renderEchartDom();
  }

  // remove
  componentWillUnmount() {
    echarts.dispose(this.myRef);
  }

  getEchartsInstance() {
    // return the echart object
    return echarts.getInstanceByDom(this.myRef) ||
      echarts.init(this.myRef, this.props.theme);
  }

  // render dom
  renderEchartDom() {
    // init the echart object
    const echartObj = this.getEchartsInstance();

    // get the option
    const { option } = this.props;

    echartObj.setOption(option);

    if (this.offsetWidth !== this.myRef.offsetWidth ||
        this.offsetHeight !== this.myRef.offsetHeight) {
      echartObj.resize();
    }

    // set loading mask
    if (this.props.showLoading) {
      echartObj.showLoading();
    } else {
      echartObj.hideLoading();
    }

    return echartObj;
  }

  render() {
    return (
      <div
        ref={(elem) => (this.myRef = elem)}
        className="m-echart stats-group-canvas"
        style={this.props.style}
      />
    );
  }
}

ReactEchart.propTypes = propTypes;
ReactEchart.defaultProps = defaultProps;

export default ReactEchart;
