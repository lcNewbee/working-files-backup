import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormGroup from 'shared/components/Form/FormGroup';
import { List } from 'immutable';
import validator from 'shared/validator';
import utils from 'shared/utils';
import urls from 'shared/config/urls';

const msg = {
  password: __('Password'),
  confirmpasswd: __('Confirm Password'),
};

const formGroups = List([
  {
    input: {
      type: 'password',
      label: msg.password,
      name: 'password',
      maxLength: 21,
      placeholder: msg.password,
    },
    validator: validator({
      label: msg.password,
      rules: 'required',
    }),
  }, {
    input: {
      label: msg.confirmpasswd,
      type: 'password',
      name: 'confirmpasswd',
      maxLength: 21,
      placeholder: msg.confirmpasswd,
    },
    validator: validator({
      label: msg.confirmpasswd,
      rules: 'required',
    }),
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map).isRequired,
};
const defaultProps = {};

// 原生的 react 页面
export class SignUp extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      confirmpasswd: '',
    };
    utils.binds(this, [
      'checkData',
      'signUp',
      'onSignUp',
      'onChangeData',
      'getDataValue',
      'onInputKeyUp',
      'createList',
    ]);
  }

  componentWillMount() {
    document.getElementsByTagName('body')[0].className += ' sign-body';
  }

  componentWillUnmount() {
    const currClass = document.getElementsByTagName('body')[0].className;

    document.getElementsByTagName('body')[0].className = currClass.replace(' sign-body', '');
  }

  onSignUp() {
    const checkResult = this.checkData();

    // 如果有验证错误信息
    if (checkResult) {
      this.setState({
        status: checkResult,
      });

    //
    } else {
      this.signUp();
    }
  }

  onChangeData(name) {
    return function (options) {
      const data = {};

      data[name] = options.value;
      this.setState(data);
    }.bind(this);
  }

  onInputKeyUp(e) {
    if (e.which === 13) {
      if (e.target.id === 'password') {
        document.getElementById('confirmpasswd').focus();
      } else {
        this.onSignUp();
      }
    }
  }

  getDataValue(name) {
    return this.state[name] || '';
  }

  checkData() {
    const data = this.state;
    let checkResult;

    formGroups.forEach(
      (item) => {
        const key = item.input.name;
        let ret = item;

        checkResult = item.validator.check(data[key]);

        if (checkResult) {
          ret = false;
        }

        return ret;
      },
    );

    if (!checkResult) {
      if (this.state.password !== this.state.confirmpasswd) {
        checkResult = __('Password and confirm password must match');
      }
    }

    return checkResult;
  }

  signUp() {
    utils.save(urls.regist, {
      password: this.state.password,
      confirmpasswd: this.state.confirmpasswd,
    })
    .then((json) => {
      if (json.state && json.state.code === 2000) {
        window.location.hash = '';
      }
    });
  }
  createList(item) {
    const input = item.input;

    return (
      <FormGroup
        {...input}
        key={input.name}
        id={input.name}
        value={this.getDataValue(input.name)}
        onChange={this.onChangeData(input.name)}
        onKeyUp={this.onInputKeyUp}
      />
    );
  }
  render() {
    const { version } = this.props.app.toJS();

    return (
      <div>
        <header className="navbar">
          <div className="brand" />
          <h1>{__('Axilspot Access Manager')}</h1>
          <span className="version">GUI {version}</span>
        </header>
        <div className="sign sign-up">
          <div className="sign-backdrop" />
          <div className="sign-content">
            <h1>{__('Please Sign Up')}</h1>
            {
              formGroups.map(
                item => this.createList(item),
              )
            }
            <a href="#/" className="help-link">{__('Login in')}</a>
            {
              this.state.status !== 'ok' ?
                <p className="msg-error ">{this.state.status}</p> :
                ''
            }
            <button
              className="btn btn-info btn-lg"
              onClick={this.onSignUp}
            >
              {__('Sign Up')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = propTypes;
SignUp.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
)(SignUp);
