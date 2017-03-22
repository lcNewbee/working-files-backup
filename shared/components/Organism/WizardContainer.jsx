import React, { PropTypes } from 'react';
import { List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import utilsCore from 'shared/utils/lib/core';

import {
  Button, SaveButton,
} from '../Button';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm']),
  title: PropTypes.string,
  nextDisabled: PropTypes.bool,
  initStep: PropTypes.number,
  saving: PropTypes.bool,
  animation: PropTypes.bool,
  options: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.instanceOf(List),
  ]),

  // 可以是函数或Promise对象
  onBeforeStep: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  onAfterStep: PropTypes.func,
  onCompleted: PropTypes.func,
  reinitAt: PropTypes.any,
};
const defaultProps = {
  initStep: 0,
  options: List([]),
  nextDisabled: false,
  animation: false,
  onBeforeStep: utilsCore.emptyFunc,
};

class WizardContainer extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      currStep: props.initStep,
      maxStep: props.options.size,
      status: 'ok',
      direction: 'left',
    };
    utilsCore.binds(
      this,
      ['onNext', 'onPrev', 'updateState', 'onChangeStep'],
    );
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.initStep !== nextProps.initStep ||
        this.props.reinitAt !== nextProps.reinitAt) {
      this.updateState({
        currStep: nextProps.initStep,
        maxStep: nextProps.options.size,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { onAfterStep } = this.props;

    // 单currStep发生改变时，调用 onAfterStep
    if ((prevState.currStep !== this.state.currStep) &&
        (this.state.currStep !== this.props.options.size - 1)) {
      if (onAfterStep) {
        onAfterStep({
          currStep: this.state.currStep,
          prevStep: prevState.currStep,
        });
      }
    }
  }

  onChangeStep(stepObj, direction) {
    const { onBeforeStep } = this.props;
    const handleChange = (msg) => {
      if (!msg) {
        this.updateState({
          currStep: stepObj.targetStep,
          status: 'ok',
          direction,
        });
      } else {
        this.updateState({
          status: msg,
        });
      }
      this.onBeforeSteping = false;
    };
    let msg;
    let beforeStepResult = null;

    // 如果正在切换中则不响应切换事件
    if (!this.onBeforeSteping) {
      if (onBeforeStep) {
        beforeStepResult = onBeforeStep(stepObj);
      }

      // 如果 onBeforeNext 为 Promise 对象
      if (beforeStepResult && utilsCore.isPromise(beforeStepResult)) {
        this.onBeforeSteping = true;
        beforeStepResult.then((result) => {
          handleChange(result);
        })
        .catch(
          () => (this.onBeforeSteping = false),
        );

      // 如果 onBeforeNext 回调函数
      } else {
        msg = beforeStepResult;

        handleChange(msg);
      }
    }
  }

  onNext() {
    const { onCompleted, options, nextDisabled } = this.props;
    const MAX_STEP = options.size;
    let currStep = this.state.currStep;
    let stepObj;

    // 没有禁用next按钮,执行切换
    if (!nextDisabled) {
      if (currStep < MAX_STEP - 1) {
        currStep += 1;
        stepObj = {
          currStep: currStep - 1,
          targetStep: currStep,
        };

        this.onChangeStep(stepObj, 'left');
      }
    }

    // 执行完成
    if (this.state.currStep === (MAX_STEP - 1) && onCompleted) {
      onCompleted({
        currStep: this.state.currStep,
        targetStep: currStep,
      });
    }

    return nextDisabled;
  }

  onPrev() {
    const currStep = this.state.currStep;
    let targetStep = currStep;

    if (currStep > 0) {
      targetStep = currStep - 1;

      this.onChangeStep({
        currStep,
        targetStep,
      }, 'right');
    }
  }

  updateState(data) {
    this.setState(utilsCore.extend({}, this.state, data));
  }

  render() {
    const { options, title, size, className, nextDisabled } = this.props;
    const { currStep, maxStep, status, direction } = this.state;
    const styleWidth = (100 / options.size);
    const navStyle = {
      width: `${styleWidth}%`,
    };
    const curRender = options.getIn([currStep, 'render']);
    let classNames = 'o-wizard';

    if (size) {
      classNames = `${classNames} o-wizard--${size}`;
    }

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

                if (index < currStep) {
                  myClassName += 'completed';
                } else if (index === currStep) {
                  myClassName += 'active';
                }

                return (
                  <li key={stepNavKey} className={myClassName} style={navStyle}>
                    <span className="icon" />
                    <h3>{index + 1}. {item.get('title')}</h3>
                  </li>
                );
              }) : null
            }
          </ul>
        </div>
        <ReactCSSTransitionGroup
          component="div"
          transitionName={`slide-${direction}`}
          transitionEnter={this.props.animation}
          transitionLeave={false}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={0}
        >
          <div key={`wizardStep${currStep}`} className="o-wizard__content" >
            {
              curRender ? curRender() : null
            }

            {
              status !== 'ok' ? (
                <p className="msg-error">
                  {status}
                </p>
              ) : null
            }
          </div>
        </ReactCSSTransitionGroup>
        <div className="o-wizard__footer">
          {
            currStep > 0 ? (
              <Button
                onClick={this.onPrev}
                text={__('Back')}
              />
            ) : null
          }
          {
            currStep !== (maxStep - 1) ? (
              <Button
                theme="info"
                onClick={this.onNext}
                disabled={nextDisabled}
                text={__('Next Step')}
              />
            ) : (
              <SaveButton
                theme="info"
                loading={this.props.saving}
                onClick={this.onNext}
                text={__('Completed')}
              />
            )
          }
        </div>
      </div>
    );
  }
}
WizardContainer.propTypes = propTypes;
WizardContainer.defaultProps = defaultProps;

export default WizardContainer;
