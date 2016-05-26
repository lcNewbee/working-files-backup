import React, {PropTypes} from 'react';
import utils from 'utils';
import { bindActionCreators } from 'redux';
import {fromJS, Map, List} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'utils/lib/validator';
import * as validateActions from 'actions/valid';
import * as myActions from './actions';
import myReducer from './reducer';

import {FormGroup} from 'components/Form';
import Select from 'components/Select';
import Button from 'components/Button';

const msg = {
  'upSpeed': _('Up Speed'),
  'downSpeed': _('Down Speed'),
  'selectGroup': _('Select Group')
};
const languageOptions = List(b28n.getOptions().supportLang).map((item) => {
  return {
    value: item,
    label: b28n.langMap[item] || 'English'
  }
}).toJS();
const validOptions = Map({
  oldpasswd: validator({
    rules: 'len:[1, 64]'
  }),
  newpasswd: validator({
    rules: 'len:[1,, 64]'
  }),
  
  confirmpasswd: validator({
    rules: 'len:[1,, 64]'
  })
});

const propTypes = {
  fetchDeviceGroups: PropTypes.func,
  fetching: PropTypes.bool,
  data: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List)
};

export const Admin = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
  },
  
  componentWillUnmount() {
    this.props.resetVaildateMsg();
  },
  
  onSave() {
    this.props.validateAll(function (invalid) {
      if (invalid.isEmpty()) {
        this.props.savePassword();
      }
    }.bind(this));
  },
  
  createUpdateFunc(name) {
    return function(data) {
      let settings = {};
      
      settings[name] = data.value
      this.props.changePasswordSettings(settings);
    }.bind(this) 
  },
  
  onChangeLang(data) {
    b28n.setLang(data.value);
    window.location.reload();
  },
  
  getSetting(name) {
    return this.props.store.getIn(['data', name])
  },
  
  render() {
    const {oldpasswd, newpasswd, confirmpasswd} = this.props.validateOption;
    
    return (
      <form>
        <h3>{_('Change Password')}</h3>
        
        <FormGroup
          type="password"
          label={_('Old Password')}
          required={true}
          name="oldpasswd"
          value={this.getSetting('oldpasswd')}
          onChange={this.createUpdateFunc('oldpasswd')}
          {...oldpasswd}
        />
        
        <FormGroup
          type="password"
          label={_('New Password')}
          required={true}
          name="newpasswd"
          value={this.getSetting('newpasswd')}
          onChange={this.createUpdateFunc('newpasswd')}
          {...newpasswd}
        />
        
        <FormGroup
          type="password"
          label={_('Confirm Password')}
          required={true}
          name="confirmpasswd"
          value={this.getSetting('confirmpasswd')}
          onChange={this.createUpdateFunc('confirmpasswd')}
          {...confirmpasswd}
        />
        
        <h3>{_('System Settings')}</h3>
        
        <FormGroup
          label={_('Select Language')}
          type="select"
          options={languageOptions}
          value={b28n.getLang()}
          onChange={this.onChangeLang}
        />
        
        <div className="form-group">
          <div className="form-control">
             <Button
              type='button'
              text={_('Save')}
              role="save"
              onClick={this.onSave}
            />
          </div>
        </div>
      </form>
    );
  }
});

Admin.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    store: state.admin,
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    validateActions,
    myActions
  ), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Admin);

export const reducer = myReducer;
