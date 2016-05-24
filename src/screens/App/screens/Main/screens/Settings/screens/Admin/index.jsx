import React, {PropTypes} from 'react';
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
  
  onSave() {
     this.props.savePassword();
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
  
  render() {
    const selectOptions = this.props.groups.map(function(item) {
      return {
        value: item.get('groupname'),
        label: item.get('groupname')
      }
    }).toJS();
     
    return (
      <form>
        <h3>{_('Change Password')}</h3>
        
        <FormGroup
          label={_('Old Password')}
          name="oldpasswd"
          onChange={this.createUpdateFunc('oldpasswd')}
        />
        
        <FormGroup
          type="password"
          label={_('New Password')}
          name="newpasswd"
          onChange={this.createUpdateFunc('newpasswd')}
        />
        
        <FormGroup
          type="password"
          label={_('Confirm Password')}
          name="confirmpasswd"
          onChange={this.createUpdateFunc('confirmpasswd')}
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

//React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  var myState = state.bandwidth;

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    groups: state.groupSettings.getIn(['data', 'list'])
  };
}


export const Screen = connect(
  mapStateToProps,
  myActions
)(Admin);

export const reducer = myReducer;
