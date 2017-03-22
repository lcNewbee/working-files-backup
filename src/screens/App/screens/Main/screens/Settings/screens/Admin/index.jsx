import React, { PropTypes, PureComponent } from 'react';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import { SaveButton, FormGroup } from 'shared/components';
import validator from 'shared/validator';
import * as appActions from 'shared/actions/app';
import * as myActions from './actions';
import myReducer from './reducer';

const languageOptions = List(b28n.getOptions().supportLang).map((item) => (
  {
    value: item,
    label: b28n.langMap[item] || 'English',
  }
)).toJS();

const validOptions = Map({
  oldpasswd: validator({}),
  newpasswd: validator({
    rules: 'len:[8, 32]',
  }),

  confirmpasswd: validator({
    rules: 'len:[8, 32]',
  }),
});

const propTypes = {
  resetVaildateMsg: PropTypes.func,
  resetPassword: PropTypes.func,
  validateAll: PropTypes.func,
  savePassword: PropTypes.func,
  changeLoginStatus: PropTypes.func,
  changePasswordSettings: PropTypes.func,
  createModal: PropTypes.func,
  validateOption: PropTypes.object,
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};
const defaultProps = {};

export default class Admin extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onSave', 'onUpdate', 'combine',
      'onChangeLang', 'onChangeLang', 'getSetting',
    ]);
  }

  componentWillUnmount() {
    this.props.resetVaildateMsg();
    this.props.resetPassword();
  }

  onSave() {
    this.props.validateAll()
      .then((invalid) => {
        if (invalid.isEmpty() && !this.combine()) {
          this.props.savePassword(() => {
            this.props.changeLoginStatus('0');
            window.location.hash = '#';
          });
        }
      });
  }

  onUpdate(name, data) {
    const settings = {};

    settings[name] = data.value;
    this.props.changePasswordSettings(settings);
  }

  onChangeLang(data) {
    if (b28n.getLang() !== data.value) {
      b28n.setLang(data.value);
      window.location.reload();
    }
  }

  getSetting(name) {
    return this.props.store.getIn(['data', name]);
  }
  combine() {
    const { newpasswd, confirmpasswd } = this.props.store.get('data').toJS();
    let ret;

    if (newpasswd !== confirmpasswd) {
      ret = __('New password and confirm password must match');

      this.props.createModal({
        id: 'admin',
        role: 'alert',
        text: ret,
      });
    }

    return ret;
  }

  render() {
    const { oldpasswd, newpasswd, confirmpasswd } = this.props.validateOption;
    const noControl = this.props.app.get('noControl');

    return (
      <form>
        <h3>{__('Change Password') }</h3>

        <FormGroup
          type="password"
          label={__('Old Password')}
          name="oldpasswd"
          value={this.getSetting('oldpasswd')}
          onChange={(data) => this.onUpdate('oldpasswd', data)}
          {...oldpasswd}
          required
        />

        <FormGroup
          type="password"
          label={__('New Password')}
          name="newpasswd"
          value={this.getSetting('newpasswd')}
          onChange={(data) => this.onUpdate('newpasswd', data)}
          {...newpasswd}
          required
        />

        <FormGroup
          type="password"
          label={__('Confirm Password')}
          name="confirmpasswd"
          value={this.getSetting('confirmpasswd')}
          onChange={(data) => this.onUpdate('confirmpasswd', data)}
          {...confirmpasswd}
          required
        />

        <div className="form-group form-group-save">
          <div className="form-control">
            {
              this.props.store.getIn(['state', 'code']) === 4000 ? (
                <div>
                  <p className="error">{__('Old password error!') }</p>
                </div>
              ) : null
            }
            {
              noControl ? null : (
                <SaveButton
                  type="button"
                  loading={this.props.app.get('saving')}
                  onClick={this.onSave}
                />
              )
            }
          </div>
        </div>

        <h3>{__('System Settings') }</h3>

        <FormGroup
          label={__('Select Language')}
          type="select"
          options={languageOptions}
          value={b28n.getLang()}
          onChange={this.onChangeLang}
        />

      </form>
    );
  }
}

Admin.propTypes = propTypes;
Admin.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    store: state.admin,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    myActions
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Admin);

export const reducer = myReducer;
