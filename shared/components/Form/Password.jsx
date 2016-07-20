import React, { PropTypes } from 'react';
import Icon from '../Icon';
import Input from './Input';

const propTypes = {
  className: PropTypes.string,
  seeAble: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['text', 'password']),
};

const defaultProps = {
  seeAble: true,
};

class Password extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSee: false,
    };

    this.onChange = this.onChange.bind(this);
    this.seePassword = this.seePassword.bind(this);
  }

  componentDidMount() {
    const { autoFocus } = this.props;

    if (autoFocus) {
      this.myRef.passwordInput.focus();
    }
  }


  onChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e);
    }
  }

  seePassword() {
    this.setState({
      isSee: !this.state.isSee,
    });
    this.refs.passwordInput.focus();
  }

  render() {
    const { isSee } = this.state;
    let { type } = this.props;
    let iconName = 'eye';

    if (isSee) {
      type = 'text';
      iconName = 'eye-slash';
    }

    return (
      <div className="input-password">
        <Icon className="icon" name={iconName} onClick={this.seePassword} />

        <Input
          {...this.props}
          ref={(ref) => (this.myRef = ref)}
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
