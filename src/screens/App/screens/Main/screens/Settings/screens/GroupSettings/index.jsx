import React from 'react';
import { bindActionCreators } from 'redux';
import {fromJS} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
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
export const GroupSettings = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
    this.props.fetchDeviceGroups();
    this.props.fetchGroupDevices();
  },
  
  getEditVal(key) {
    var ret = '';
    
    if(this.props.edit) {
      ret = this.props.edit.get(key);
    }
    return ret;
  },
  
  onSelectDevice(e) {
    let elem = e.target;
    let mac = elem.value;
    
    if(elem.checked) {
      this.props.selectDevice(mac);
    } else {
      this.props.selectDevice(mac, true);
    }
  },

  onAddGroup() {
    this.props.addDeviceGroup();
  },

  onEditGroup(groupname) {
     this.props.editDeviceGroup(groupname);
  },

  onDeleteGroup(groupname) {
    var comfri_text = _('Are you sure delete group: %s?', groupname);
    
    if(confirm(comfri_text)) {
      this.props.deleteDeviceGroup(groupname)
    }
  },
  
  onChangeGroupname(e) {
    var groupname = e.target.value;
     
    this.props.changeEditGroup({
      groupname
    })
  },
  
  onChangeRemark(e) {
    var remark = e.target.value;
    this.props.changeEditGroup({
      remark
    })
  },

  render() {
    var groupTableOptions = [{
      'id': 'groupname',
      'text': msg.groupname
    }, {
      'id': 'remark',
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
        'text': _('MAC Address') + '/' + _('Name'),
        transform: function(item) {
          return item.get('devicename') || item.get('mac');
        }
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
          var deviceMac;
          var selectedDevices = this.props.edit.get('devices');
          
          if(!item.get('devicename')) {
            return '';
          }
          deviceMac = item.get('mac');
         
          return (
            <div>
              <input
                type="checkbox"
                value={deviceMac}
                onChange={this.onSelectDevice}
                checked={selectedDevices.indexOf(deviceMac) !== -1}
              />
            </div>
          )
        }.bind(this)
      }];
    let modalTitle = this.getEditVal('orignName');
    
    if(this.props.actionType === 'add') {
      modalTitle = msg.add;
    } else {
      modalTitle = msg.edit + modalTitle;
    }
    
    return (
      <div>
        <h3>{_('Group List')}</h3>
        <Table
          className="table"
          options={fromJS(groupTableOptions)}
          list={this.props.data.get('list')}
        />
        <div className="form-footer">
          <Button
            role="plus"
            className="fr"
            onClick={this.onAddGroup}
            text={msg.add}
          />
        </div>
        
          
        <Modal
          isShow={this.props.edit ? true : false}
          title={modalTitle}
          onClose={this.props.removeEditDeviceGroup}
          onOk={this.props.saveDeviceGroup}
        >
          <FormGruop
            label={msg.groupname}
            value={this.getEditVal('groupname')}
            updater={this.onChangeGroupname}
          />
          <FormGruop
            label={msg.remarks}
            value={this.getEditVal('remark')}
            updater={this.onChangeRemark}
          />
          <Table
            className="table"
            options={fromJS(devicesTableOptions)}
            list={this.props.devices.get('list')}
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

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    actionType: myState.get('actionType'),
    edit: myState.get('edit'),
    devices: myState.get('devices')
  };
}


// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(GroupSettings);

export const settings = reducer;

