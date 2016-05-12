import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as myActions from './actions';
import myReducer from './reducer';
import validator from 'utils/lib/validator';


import {FormGruop} from 'components/Form/Input';
import Select from 'components/Select';
import Button from 'components/Button';

const msg = {
  'upSpeed': _('Up Speed'),
  'downSpeed': _('Down Speed'),
  'selectGroup': _('Select Group')
};

const propTypes = {
  fetchDeviceGroups: PropTypes.func,
  fetching: PropTypes.bool,
  data: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List)
};

export const Password = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
  },
  
  onSave() {
     this.props.savePassword();
  },
  
  createUpdateFunc(name) {
    return function(e) {
      const elem = e.target;
      let data = {};
      
      if(elem.type !== 'checkbox') {
        data[name] = e.target.value;
      } else {
        
        if(elem.checked) {
          data[name] = '1';
        } else {
          data[name] = '0';
        }
      }
      
      this.props.changePasswordSettings(data);
    }.bind(this) 
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
        <h3>修改密码</h3>
        
        <FormGruop
          label={_('Old Password')}
          name="oldpasswd"
          updater={this.createUpdateFunc('oldpasswd')}
        />
        
        <FormGruop
          type="password"
          label={_('New Password')}
          name="newpasswd"
          updater={this.createUpdateFunc('newpasswd')}
        />
        
        <FormGruop
          type="password"
          label={_('Confirm Password')}
          name="confirmpasswd"
          updater={this.createUpdateFunc('confirmpasswd')}
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

Password.propTypes = propTypes;

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
)(Password);

export const reducer = myReducer;
