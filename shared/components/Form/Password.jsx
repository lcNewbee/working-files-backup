import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Icon from '../Icon';
import Input from './atom/Input';

const propTypes = {
  seeAble: PropTypes.bool,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['text', 'password']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  display: PropTypes.oneOf(['block', 'inline', 'inline-block']),
  style: PropTypes.object,
  isFocus: PropTypes.bool,
};

const defaultProps = {
  seeAble: true,
};

const inputStyle = {
  width: '100%',
};

class Password extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSee: false,
      isFocus: !!props.autoFocus,
    };

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.seePassword = this.seePassword.bind(this);
  }


  onChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e);
    }
  }

  seePassword() {
    this.setState({
      isSee: !this.state.isSee,
      isFocus: true,
    });
  }

  render() {
    const { isSee, isFocus } = this.state;
    const { display, style, seeAble, className, ...restProps } = this.props;
    const myIsFocus = isFocus || this.props.isFocus;
    let passwordClassName = 'a-password';
    let iconClassName = 'a-password__icon';
    let { type } = this.props;
    let showIcon = true;
    let iconName = 'eye';

    if (isSee) {
      type = 'text';
      iconName = 'eye-slash';
      iconClassName = 'a-password__icon a-password__icon--hidden';
    }

    if (this.props.value === '') {
      showIcon = false;
    }

    showIcon = seeAble && showIcon;

    if (className) {
      passwordClassName = `${passwordClassName} ${className}`;
    }

    if (display) {
      passwordClassName = `${passwordClassName} a-password--${display}`;
    }

    return (
      <div
        className={passwordClassName}
        style={style}
      >
        {
          showIcon ? (
            <Icon
              className={iconClassName}
              name={iconName}
              onClick={this.seePassword}
            />
          ) : null
        }

        <Input
          {...restProps}
          className="a-password__input"
          style={inputStyle}
          isFocus={myIsFocus}
          type={type}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

Password.propTypes = propTypes;
Password.defaultProps = defaultProps;

export default Password;
