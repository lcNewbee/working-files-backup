import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'utils/lib/validator';
import * as myActions from './actions';
import * as validateActions from 'actions/valid';
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
        
        <h3>{_('Qos Settings')}</h3>
       
        <FormGruop
          label={msg.upSpeed}
          required={true}
          maxLength="6"
          help="KB"
          value={currData.get('upstream')}
          updater={this.onChangeUpSpeed}
          {...upstream}
        />
        
        <FormGruop
          label={msg.downSpeed}
          help="KB"
          maxLength="6"
          required={true}
          value={currData.get('downstream')}
          updater={this.onChangeDownSpeed}
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
  return bindActionCreators(Object.assign({},
    validateActions,
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
