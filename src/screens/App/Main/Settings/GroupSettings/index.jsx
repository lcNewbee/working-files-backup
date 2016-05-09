import React from 'react';
import { bindActionCreators } from 'redux';
import {fromJS} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import {fetchDevices} from '../Devices/actions';
import reducer from './reducer';

import {FormGruop} from 'components/Form/Input';
import {Table} from 'components/Table';
import Modal from 'components/Modal';
import Button from 'components/Button';

const msg = {
  delete: _('Delete'),
  edit: _('Edit'),
  add: _('Add'),
  remarks: _('Remarks'),
  groupname: _('Group Name'),
  action: _('Actions')
}

// 原生的 react 页面
export const Settings = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.props.fetchDeviceGroups();
    this.props.fetchDevices();
  },

  onAddGroup() {
    this.props.addDeviceGroups();
  },

  onEditGroup(groupname) {
     this.props.editDeviceGroups(groupname);
  },

  onDeleteGroup(groupname) {
    var comfri_text = _('Are you sure delete group: %s?', groupname);
    
    if(confirm(comfri_text)) {
      this.props.deleteDeviceGroups(groupname)
    }
  },

  render() {
    var groupTableOptions = [{
      'id': 'groupname',
      'text': msg.groupname
    }, {
      'id': 'remarks',
      'text': msg.remarks
    }, {
      'id': 'op',
      'text': msg.action,
      transform: function(item) {
        return (
          <div>
            <Button
              onClick={this.onEditGroup.bind(this, item.get('groupname'))}
              role="edit"
              text={msg.edit}
              size="sm"
            />

            <Button
              id={item.get('id')}
              role="trash"
              onClick={this.onDeleteGroup.bind(this, item.get('groupname'))}
              text={msg.delete}
              size="sm"
            />
              
          </div>
        )
      }.bind(this)
    }];
    
    var devicesTableOptions = [{
        'id': 'devicename',
        'text': _('MAC Address') + '/' + _('Name')
      }, {
        'id': 'ip',
        'text': _('IP Address')
      }, {
        'id': 'status',
        'text': _('Online Status')
      }, {
        'id': 'op',
        'text': _('Select'),
        transform: function(item) {
          var deviceMac = item.get('devicename').split('/')[0];
          
          return (
            <div>
              <input type="checkbox" value={deviceMac} />
            </div>
          )
        }.bind(this)
      }];
    let modalTitle = this.props.data.getIn(['edit', 'groupname']);
    
    modalTitle = modalTitle ? (msg.edit + modalTitle) : msg.add;
    
    return (
      <div>

        <Table
          className="table"
          options={fromJS(groupTableOptions)}
          list={this.props.data.get('list')}
        />

        <Button
          role="plus"
          className="fr"
          onClick={this.onAddGroup}
          text={msg.add}
        />
          
        <Modal
          isShow={this.props.data.get('edit') ? true : false}
          title={modalTitle}
          onClose={this.props.removeEditDeviceGroups}
        >
          <FormGruop
            label={msg.groupname}
            value={this.props.data.getIn(['edit', 'groupname'])}
          />
          <FormGruop
            label={msg.remarks}
            value={this.props.data.getIn(['edit', 'remarks'])}
          />
          <Table
            className="table"
            options={fromJS(devicesTableOptions)}
            list={this.props.devices}
            page={this.props.page}
          />
        </Modal>
      </div>
    );
  }
});

//React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  var myState = state.groupSettings;
  var devices = state.devices.getIn(['data', 'list']);
  var page = state.devices.getIn(['data', 'page'])

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    devices,
    page
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({fetchDevices}, actions), dispatch)
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

export const settings = reducer;

