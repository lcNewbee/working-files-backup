import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import echarts from 'echarts';

// /**
//  * echarts图标按需引入
//  */
// // 引入柱状图
// require('echarts/lib/chart/bar');

// // 引入折线图
// require('echarts/lib/chart/line');
// require('echarts/lib/chart/lines');

// // 引入折饼图
// require('echarts/lib/chart/pie');

// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/legend');
// require('echarts/lib/component/title');

const propTypes = {
  option: PropTypes.object,
  onEvents: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
  theme: PropTypes.string,
  onChartReady: PropTypes.func,
  showLoading: PropTypes.bool,

  // 每次跟新数据前是否 clear
  needClear: PropTypes.bool,
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
      Object.keys(onEvents).forEach((eventName) => {
        const eventFunc = onEvents[eventName];

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
  componentDidUpdate(prevProps) {
    if (this.props.option !== prevProps.option) {
      this.renderEchartDom(true);
    } else {
      this.renderEchartDom();
    }
  }

  // remove
  componentWillUnmount() {
    echarts.dispose(this.myRef);
  }

  getEchartsInstance(nneed) {
    if (nneed) {
      echarts.dispose(this.myRef);
    }
    return echarts.getInstanceByDom(this.myRef) ||
        echarts.init(this.myRef, this.props.theme);
  }

  // render dom
  renderEchartDom(shouldInit) {
    // get the option
    const { option, needClear } = this.props;

    // init the echart object
    const echartObj = this.getEchartsInstance(needClear || shouldInit);

    // 必要时清除图表缓存
    if (needClear || shouldInit) {
      echartObj.clear();
    }

    if (option) {
      echartObj.setOption(option);
    }

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
    const className = this.props.className;
    let classNames = 'm-echart';

    if (className) {
      classNames = `${classNames} ${className}`;
    }
    return (
      <div
        ref={(elem) => {
          if (elem !== null) {
            this.myRef = elem;
          }
        }}
        className={classNames}
        style={this.props.style}
      />
    );
  }
}

ReactEchart.propTypes = propTypes;
ReactEchart.defaultProps = defaultProps;

export default ReactEchart;
