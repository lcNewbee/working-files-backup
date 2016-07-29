import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Icon from '../Icon';
import Input from './atom/Input';

const propTypes = {
  className: PropTypes.string,
  seeAble: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['text', 'password']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  role: PropTypes.oneOf(['block']),
};

const defaultProps = {
  seeAble: true,
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
    const { role } = this.props;
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

    if (role) {
      passwordClassName = `${passwordClassName} a-password--${role}`;
    }

    return (
      <div className={passwordClassName}>
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
          {...this.props}
          isFocus={isFocus}
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
