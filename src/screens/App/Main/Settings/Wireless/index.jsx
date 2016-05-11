import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as myActions from './actions';
import { fetchDeviceGroups } from '../GroupSettings/actions';
import myReducer from './reducer';

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

export const Bandwidth = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
    this.props.fetchDeviceGroups();
  },
  
  onChangeUpSpeed() {
    
  },
  
  onChangeDownSpeed() {
    
  },
  
  render() {
    const selectOptions = this.props.groups.map(function(item) {
      return {
        value: item.get('groupname'),
        label: item.get('groupname')
      }
    }).toJS();

    return (
      <div>
        <div className="form-group">
          <label htmlFor="">{msg.selectGroup}</label>
          <div className="form-control">
            <Select
              options={selectOptions}
            />
          </div>
        </div>
        
        <div className="form-group">
          <div className="form-control">
             <Button
              type='button'
              text={_('Save')}
              role="save"
            />
          </div>
        </div>
      </div>
    );
  }
});

Bandwidth.propTypes = propTypes;

//React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  var myState = state.bandwidth;

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    groups: state.groupSettings.getIn(['data', 'list'])
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({fetchDeviceGroups}, myActions), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bandwidth);

export const reducer = myReducer;
