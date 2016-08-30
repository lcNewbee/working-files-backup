import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormInput from './FormInput';

const propTypes = {
  onValidError: PropTypes.func,
  errMsg: PropTypes.string,
  help: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  validateAt: PropTypes.number,
  name: PropTypes.string,
  validator: PropTypes.object,
  display: PropTypes.string,
  role: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  'data-label': PropTypes.string,
};

const defaultProps = {

};

class FormGroup extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.check = this.check.bind(this);
    this.checkClear = this.checkClear.bind(this);
    this.clearValidError = this.clearValidError.bind(this);
  }
  componentDidUpdate(prevProps) {
    const { value } = this.props;

    // 数据为空或有数据验证对象，需进行数据验证
    if (this.props.validator || value === '' || value === undefined) {

      // 如果组是可用的
      if (!this.props.disabled) {
        if (prevProps.value !== value) {
          this.checkClear();
        } else if (prevProps.validateAt !== this.props.validateAt) {
          if (this.myRef.offsetWidth > 0) {
            this.check();
          }
        }
      } else {
        this.clearValidError();
      }
    }
  }

  // 验证不确定的错误
  check() {
    const { name, label, value, required } = this.props;
    let checkResult;

    // 空字符串验证
    if (value === '' || value === undefined) {
      if (required) {
        checkResult = _('%s is required', label || this.props['data-label']);
      }

    // 不为空，validator验证对象验证
    } else if (this.props.validator) {
      checkResult = this.props.validator.check(value);
    }

    // 只有onValidError函数存在时才上报错误数据
    if (this.props.onValidError) {
      this.props.onValidError({ name, checkResult });
    }
  }

  // 验证可确定的错误
  checkClear() {
    const { name, value } = this.props;
    let checkResult;

    if (this.props.validator) {
      checkResult = this.props.validator.checkClear(value);
      if (this.props.onValidError) {
        this.props.onValidError({ name, checkResult });
      }
    }
  }

  // clearError
  clearValidError() {
    this.props.onValidError({
      name: this.props.name,
      checkResult: undefined,
    });
  }

  render() {
    const {
      help, errMsg, required, children, role, id, label,
      className, display,
    } = this.props;
    const { check, checkClear } = this;
    let groupClassName = 'form-group';

    if (role) {
      groupClassName += ` form-group--${role}`;
    }

    if (errMsg) {
      groupClassName = `${groupClassName} form-group--error`;
    }

    if (className) {
      groupClassName = `${groupClassName} ${className}`;
    }

    if (display) {
      groupClassName = `${groupClassName} form-group--${display}`;
    }

    return (
      <div
        className={groupClassName}
        ref={(ref) => (this.myRef = ref)}
      >
        {
          label ? (
            <label htmlFor={id}>
              {label}
              {required ? <span className="text-required">*</span> : null}
            </label>
          ) : null
        }

        <div className="form-control">
          {
            children ? React.Children.map(children, (elem) => {
              let ret = elem;

              if (elem && elem.type && elem.type.name === 'FormInput') {
                ret = React.cloneElement(elem, {
                  check,
                  checkClear,
                  isFocus: !!errMsg,
                });
              }

              return ret;
            }) : (
              <FormInput
                {...this.props}
                isFocus={!!errMsg}
                check={this.check}
                checkClear={this.checkClear}
              />
            )
          }

          {
            help ? <span className="help">{help}</span> : null
          }

          {
            errMsg ? <span className="error">{errMsg}</span> : null
          }
        </div>
      </div>);
  }
}

FormGroup.propTypes = propTypes;
FormGroup.defaultProps = defaultProps;

export default FormGroup;
