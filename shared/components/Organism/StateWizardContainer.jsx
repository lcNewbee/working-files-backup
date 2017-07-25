import React from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import { Button } from 'shared/components';

const defaultProps = {};

const propTypes = {
  stateObj: PropTypes.objectOf(Map),
  title: PropTypes.string,
  className: PropTypes.string,
};

export default class StateWizardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currState: fromJS({}),
      titleOptions: fromJS([]),
    };

    this.onPreviousButtonClick = this.onPreviousButtonClick.bind(this);
    this.onNextButtonClick = this.onNextButtonClick.bind(this);
    this.obtainStateOptions = this.obtainStateOptions.bind(this);
  }

  componentWillMount() {
    const stateObj = this.props.stateObj;
    const firstStateName = stateObj.get('initState');
    const firstState = stateObj.get(firstStateName);
    const options = this.obtainStateOptions();
    this.setState({
      currState: firstState,
      titleOptions: options,
    });
  }

  onPreviousButtonClick() {
    // 首先执行该状态下，点击下一步时的操作，比如更新数据，保存数据等
    const onPrevButtonClick = this.state.currState.get('onPrevButtonClick');
    if (typeof onNextButtonClick === 'function') {
      onPrevButtonClick();
    }
    const currState = this.state.currState;
    const prevStateName = currState.get('prevState');
    const prevState = this.props.stateObj.get(prevStateName);

    this.setState({
      currState: prevState,
    });
  }

  onNextButtonClick() {
    // 首先执行该状态下，点击下一步时的操作，比如更新数据，保存数据等，并返回一个值表示是否允许下一步
    // 返回值为真，则不允许下一步
    const onNextButtonClick = this.state.currState.get('onNextButtonClick');
    let ifForward = '';
    if (typeof onNextButtonClick === 'function') {
      ifForward = onNextButtonClick();
    }
    // 执行完自定义的操作后，跳转到下一状态
    const currState = this.state.currState;
    const nextStateName = currState.get('nextState');
    const nextState = this.props.stateObj.get(nextStateName);

    // 判断是否是最后一个状态,并且允许下一步
    if (nextState && !ifForward) {
      this.setState({ currState: nextState });
    }
  }

  // 获取状态数量以及各状态的标题
  obtainStateOptions() {
    const stateObj = this.props.stateObj;
    const initState = stateObj.initState;
    let nextState = stateObj.get(initState);
    const options = fromJS([]);
    while (nextState) {
      const stateTitle = nextState.get('stateTitle');
      const option = fromJS({ stateTitle });
      options.push(option);
      const nextStateName = nextState.get('nextState');
      nextState = stateObj.get(nextStateName);
    }
    return options;
  }

  render() {
    const { title, className } = this.props;
    const options = this.state.titleOptions;
    const styleWidth = (100 / options.size);
    const navStyle = {
      width: `${styleWidth}%`,
    };

    let classNames = 'o-wizard';

    if (className) {
      classNames = `${classNames} ${className}`;
    }
    return (
      <div className={classNames}>
        <h3 className="o-wizard__title">{title}</h3>
        <div className="o-wizard__nav">
          <ul>
            {
              options.size > 0 ? options.map((item, index) => {
                const stepNavKey = `wizardNav${index}`;
                let myClassName = '';

                {/* if (index < currStep) {
                  myClassName += 'completed';
                } else  */}
                if (item.get('stateTitle') === this.state.currState.get('stateTitle')) {
                  myClassName += 'active';
                }

                return (
                  <li key={stepNavKey} className={myClassName} style={navStyle}>
                    <span className="icon" />
                    <h3>{index + 1}. {item.get('stateTitle')}</h3>
                  </li>
                );
              }) : null
            }
          </ul>
        </div>
        <div>
          {this.state.currState.get('renderBody')()}
        </div>
        <div>
          <Button
            text={__('Previous Step')}
            onClick={this.onPreviousButtonClick}
          />
          <Button
            text={__('Next Step')}
            onClick={this.onNextButtonClick}
          />
        </div>
      </div>
    );
  }
}

StateWizardContainer.defaultProps = defaultProps;
StateWizardContainer.propTypes = propTypes;


// 遗留问题
/*
  1. 导航图标显示不出来
  2. 在第一步时，点击"上一步"会出现错误
  3. 导航图标的completed状态无法显示，需找到一个标识completed的方法
  4. stateObj中必须的项需要加以说明，即使用指南。
*/
