import React, { PropTypes } from 'react';
import { List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utilsCore from 'shared/utils/lib/core';

import {
  Button,
} from '../Button';

const propTypes = {
  className: PropTypes.string,
  layout: PropTypes.oneOf(['flow', 'block']),
  size: PropTypes.oneOf(['sm']),
  title: PropTypes.string,
  initStep: PropTypes.number,
  options: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.instanceOf(List),
  ]),

  onBeforeStep: PropTypes.func,
  onAfterStep: PropTypes.func,
  onCompleted: PropTypes.func,
};
const defaultProps = {
  initStep: 0,
  options: List([]),
};

class WizardContainer extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      currStep: props.initStep,
      maxStep: props.options.size,
      status: 'ok',
    };
    utilsCore.binds(
      this,
      ['onNext', 'onPrev', 'updateState', 'onChangeStep']
    );
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.initStep !== nextProps.initStep) {
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

  onChangeStep(stepObj) {
    const { onBeforeStep } = this.props;
    const handleChange = (msg) => {
      if (!msg) {
        this.updateState({
          currStep: stepObj.targetStep,
          status: 'ok',
        });
      } else {
        this.updateState({
          status: msg,
        });
      }
      this.onBeforeSteping = false;
    };
    let msg;

    // 如果正在切换中则不响应切换事件
    if (!this.onBeforeSteping) {
      // 如果 onBeforeNext 为 Promise 对象
      if (onBeforeStep && utilsCore.isPromise(onBeforeStep)) {
        this.onBeforeSteping = true;
        onBeforeStep(stepObj)
          .then((result) => {
            handleChange(result);
          });

      // 如果 onBeforeNext 回调函数
      } else {
        if (onBeforeStep) {
          this.onBeforeSteping = true;
          msg = onBeforeStep(stepObj);
        }

        handleChange(msg);
      }
    }
  }

  onNext() {
    const { onCompleted, options } = this.props;
    const MAX_STEP = options.size;
    let currStep = this.state.currStep;
    let stepObj;

    if (currStep < MAX_STEP - 1) {
      currStep += 1;
      stepObj = {
        currStep: currStep - 1,
        targetStep: currStep,
      };

      this.onChangeStep(stepObj);
    } else if (onCompleted) {
      onCompleted({
        currStep,
        targetStep: currStep,
      });
    }
  }

  onPrev() {
    const currStep = this.state.currStep;
    let targetStep = currStep;

    if (currStep > 0) {
      targetStep = currStep - 1;

      this.onChangeStep({
        currStep,
        targetStep,
      });
    }
  }

  updateState(data) {
    this.setState(utilsCore.extend({}, this.state, data));
  }

  render() {
    const { options, title, size, className } = this.props;
    const { currStep, maxStep, status } = this.state;
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
                let myClassName = '';

                if (index < currStep) {
                  myClassName += 'completed';
                } else if (index === currStep) {
                  myClassName += 'active';
                }

                return (
                  <li className={myClassName} style={navStyle}>
                    <span className="icon" />
                    <h3>{index + 1}. {item.get('title')}</h3>
                  </li>
                );
              }) : null
            }
          </ul>
        </div>
        <div className="o-wizard__content" >
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
        <div className="o-wizard__footer">
          {
            currStep > 0 ? (
              <Button
                onClick={this.onPrev}
                text={_('Back')}
              />
            ) : null
          }

          <Button
            theme="info"
            onClick={this.onNext}
            text={currStep !== (maxStep - 1) ? _('Next Step') : _('Completed')}
          />
        </div>
      </div>
    );
  }
}
WizardContainer.propTypes = propTypes;
WizardContainer.defaultProps = defaultProps;

export default WizardContainer;
