import React, {PropTypes} from 'react';
import Icon from '../Icon';

const propTypes = {
  className: PropTypes.string,
  seeAble: PropTypes.bool
};

const defaultProps = {
  seeAble: true
};

class Password extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSee: false
    };

    this.onChange = this.onChange.bind(this);
    this.seePassword = this.seePassword.bind(this);
  };

  onChange(e) {
    const val = e.target.value;

    if (typeof this.props.updater === 'function') {
      this.props.updater(e);
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e);
    }
  };

  seePassword() {
    this.setState({
      isSee: !this.state.isSee
    })

    this.refs.myInput.focus();
  };

  render() {
    let {type, autoFocus} = this.props;
    const {isSee} = this.state;
    let iconName = 'eye';
    let myRef = null;

    if(isSee) {
      type = 'text';
      iconName = 'eye-slash';
    }

    if(autoFocus) {
      myRef = function(input) {
        if(input != null && typeof input.focus === 'function') {
          input.focus();
        }
      }
    }

    return (
      <div className="input-password">
        <Icon className="icon" name={iconName} onClick={this.seePassword}/>

        <input {...this.props}
          ref={myRef}
          type={type}
          onChange={this.onChange}
        />
      </div>
    );
  };
};

Password.propTypes = propTypes
Password.defaultProps = defaultProps;

export default Password;
