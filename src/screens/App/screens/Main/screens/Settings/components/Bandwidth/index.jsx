import React, {PropTypes} from 'react';
import utils from 'utils';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'utils/lib/validator';
import * as myActions from './actions';
import * as appActions from 'actions/app';
import myReducer from './reducer';

import {FormGroup} from 'components/Form';
import Select from 'components/Select';
import Button from 'components/Button';

const msg = {
  'upSpeed': _('Up Speed'),
  'downSpeed': _('Down Speed'),
  'selectGroup': _('Select Group'),
  'save': _('Save')
};

const validOptions = Map({
  upstream: validator({
    rules: 'num:[0, 102400]'
  }),
  downstream: validator({
    rules: 'num:[0, 102400]',
  })
});

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
  
  componentWillUnmount() {
    this.props.resetVaildateMsg();
  },
  
  handleQosChange(data) {
    this.props.changeQosSettings(data)
  },
  
  onChangeUpSpeed(data) {
    var val = data.value;
    
    this.handleQosChange({
      upstream: val
    });
  },
  
  onChangeDownSpeed(data) {
    var val = data.value;
    
    this.handleQosChange({
      downstream: val
    });
  },
  
  onChangeGroup(item) {
    this.props.changeQosGroup(item.value);
  },
  
  onSave() {
    this.props.validateAll(function(invalid) {
      if(invalid.isEmpty()) {
        this.props.setBandwidth();
      }
    }.bind(this));
    
  },
  
  render() {
    const selectOptions = this.props.data
      .get('list').map(function(item, i) {
        return {
          value: item.get('groupname'),
          label: item.get('groupname')
        }
      }).toJS();
      
    const {upstream, downstream} = this.props.validateOption;
      
    const currData = this.props.data.get('curr');

    return (
      <div>
        <h3>{ _('Current Group') }</h3>
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
        
        <h3>{_('QoS Settings')}</h3>
       
        <FormGroup
          label={msg.upSpeed}
          required={true}
          maxLength="6"
          help="KB"
          value={currData.get('upstream')}
          onChange={this.onChangeUpSpeed}
          {...upstream}
        />
        
        <FormGroup
          label={msg.downSpeed}
          help="KB"
          maxLength="6"
          required={true}
          value={currData.get('downstream')}
          onChange={this.onChangeDownSpeed}
          {...downstream}
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
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    myActions
  ), dispatch)
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Bandwidth);

export const reducer = myReducer;
