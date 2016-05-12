import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as myActions from './actions';
import myReducer from './reducer';

import {FormGruop} from 'components/Form/Input';
import Select from 'components/Select';
import Button from 'components/Button';

const msg = {
  'upSpeed': _('Up Speed'),
  'downSpeed': _('Down Speed'),
  'selectGroup': _('Select Group'),
  'save': _('Save')
};

const propTypes = {
  fetchDeviceGroups: PropTypes.func,
  fetching: PropTypes.bool,
  data: PropTypes.instanceOf(Map)
};

export const Bandwidth = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
    this.props.fetchBandwidth();
  },
  
  handleQosChange(data) {
    this.props.changeQosSettings(data)
  },
  
  onChangeUpSpeed(e) {
    var val = e.target.value;
    
    this.handleQosChange({
      upstream: val
    });
  },
  
  onChangeDownSpeed(e) {
    var val = e.target.value;
    
    this.handleQosChange({
      downstream: val
    });
  },
  
  onChangeGroup(item) {
    this.props.changeQosGroup(item.value);
  },
  
  onSave() {
    this.props.setBandwidth();
  },
  
  render() {
    const selectOptions = this.props.data
      .get('list').map(function(item, i) {
        return {
          value: item.get('groupname'),
          label: item.get('groupname')
        }
      }).toJS();
      
    const currData = this.props.data.get('curr');

    return (
      <div>
        <h3>{_('Qos Settings')}</h3>
        <div className="form-group">
          <label htmlFor="">{msg.selectGroup}</label>
          <div className="form-control">
            <Select
              clearable={false}
              onChange={this.onChangeGroup}
              value={currData.get('groupname')}
              options={selectOptions}
            />
          </div>
        </div>
        <FormGruop
          label={msg.upSpeed}
          value={currData.get('upstream')}
          updater={this.onChangeUpSpeed}
        />
        
        <FormGruop
          label={msg.downSpeed}
          value={currData.get('downstream')}
          updater={this.onChangeDownSpeed}
        />
        
        <div className="form-group">
          <div className="form-control">
             <Button
              type='button'
              text={msg.save}
              role="save"
              onClick={this.onSave}
            />
          </div>
        </div>
      </div>
    );
  }
});
Bandwidth.propTypes = propTypes;

function mapStateToProps(state) {
  var myState = state.bandwidth;

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
  };
}


export const Screen = connect(
  mapStateToProps,
  myActions
)(Bandwidth);

export const reducer = myReducer;
