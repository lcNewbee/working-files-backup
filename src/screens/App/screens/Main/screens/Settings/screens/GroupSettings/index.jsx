import React from 'react';
import utils from 'utils';
import { bindActionCreators } from 'redux';
import {fromJS, Map} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'utils/lib/validator';
import * as validateActions from 'actions/valid';
import * as actions from './actions';
import reducer from './reducer';
import {FormGroup} from 'components/Form';
import {Table} from 'components/Table';
import Modal from 'components/Modal';
import Button from 'components/Button';

const msg = {
  delete: _('Delete'),
  edit: _('Edit'),
  look: _('See'),
  add: _('Add'),
  remarks: _('Remarks'),
  groupname: _('Group Name'),
  action: _('Actions')
};

const validOptions = Map({
  groupname: validator({
    rules: 'required'
  }),
  remarks: validator({
    rules: 'required'
  })
});

// 原生的 react 页面
export const GroupSettings = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.props.fetchDeviceGroups();
    this.props.fetchGroupDevices();
  },

  componentDidUpdate(prevProps) {
    if(prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.props.fetchDeviceGroups();
      this.props.fetchGroupDevices();
    }
  },

  componentWillUnmount() {
    this.props.resetVaildateMsg();
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

  onChangeGroupSettings(name) {
    return function(data) {
       var editObj = {};

       editObj[name] = data.value;
       this.props.changeEditGroup(editObj);
     }.bind(this)
  },

  onSaveDeviceGroup() {
    if(this.props.actionType === 'look') {
      this.onCloseEditDialog();
      return ;
    }
    this.props.validateAll(function(invalid) {
      var editData = this.props.edit.toJS();
      var groupList = this.props.data.get('list');
      var hasSameName = false;

      if(invalid.isEmpty()) {

        // 验证组名是否与其它组相同
        if(editData.groupname !== editData.orignName) {
          hasSameName = !!groupList.find(function(group) {
            return group.get('groupname').trim() === editData.groupname.trim();
          });
        }

        if(hasSameName) {
          alert(_("Group name '%s' is already in use", editData.groupname));
        } else {
          this.props.saveDeviceGroup();
        }
      }

    }.bind(this))

  },

  createLookFunc(groupname) {
    return function() {
      this.props.lookGroupDevices(groupname);
    }.bind(this)
  },

  onCloseEditDialog() {
    this.props.resetVaildateMsg();
    this.props.removeEditDeviceGroup();
  },

  getGroupTableOptions() {
    let ret = fromJS([{
      'id': 'groupname',
      'text': msg.groupname,
      transform: function(val) {

        if(val === 'Default') {
          val = _('Ungrouped Devices');
        }
        return val;
      }
    }, {
      'id': 'remark',
      'text': msg.remarks
    }, {
      'id': 'op',
      'text': msg.action,
      width: '200',
      transform: function(val, item) {
        if(item.get('groupname') === 'Default') {
          return <Button
            icon="eye"
            size="sm"
            text={msg.look}
            onClick={this.createLookFunc('Default')}
          />;
        }
        return (
          <div className="action-btns">
            <Button
              onClick={this.onEditGroup.bind(this, item.get('groupname'))}
              icon="edit"
              text={msg.edit}
              size="sm"
            />

            <Button
              id={item.get('id')}
              icon="trash"
              onClick={this.onDeleteGroup.bind(this, item.get('groupname'))}
              text={msg.delete}
              size="sm"
            />

          </div>
        )
      }.bind(this)
    }]);
    const noControl = this.props.app.get('noControl');

    if(noControl) {
      ret = ret.delete(-1);
    }

    return ret;
  },

  getDevicesTableOptions() {
    let ret = fromJS([{
        'id': 'devicename',
        'text': _('MAC Address') + '/' + _('Name'),
        transform: function(val, item) {
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
        transform: function(val, item) {
          var deviceMac;
          var selectedDevices = this.props.edit.get('devices');

          deviceMac = item.get('mac');

          return (
            <div className="action-btns">
              <input
                type="checkbox"
                value={deviceMac}
                onChange={this.onSelectDevice}
                checked={selectedDevices.indexOf(deviceMac) !== -1}
              />
            </div>
          )
        }.bind(this)
      }]);
    const noControl = this.props.app.get('noControl');

    if(noControl) {
      ret = ret.delete(-1);
    }
    return ret;
  },

  render() {
    const {groupname, remarks} = this.props.validateOption;
    const groupTableOptions = this.getGroupTableOptions();
    const devicesTableOptions = this.getDevicesTableOptions();
    const isLook = this.props.actionType === 'look';
    const noControl = this.props.app.get('noControl');
    let modalTitle = this.getEditVal('orignName');

    if(this.props.actionType === 'add') {
      modalTitle = msg.add;
    } else if (this.props.actionType === 'edit') {
      modalTitle = msg.edit + ' ' + modalTitle;
    } else if(this.props.actionType === 'look') {
      modalTitle = _('Ungrouped Devices');
    }

    return (
      <div>
        <h3>{_('Group List')}</h3>
        <Table
          className="table"
          loading={this.props.fetching}
          options={fromJS(groupTableOptions)}
          list={this.props.data.get('list')}
        />
        <div className="form-footer">
          {
            noControl ? null : (
              <Button
                icon="plus"
                className="fr"
                role="primary"
                onClick={this.onAddGroup}
                text={msg.add}
              />
            )
          }

        </div>

        <Modal
          isShow={this.props.edit ? true : false}
          title={modalTitle}
          onClose={this.onCloseEditDialog}
          onOk={this.onSaveDeviceGroup}
        >
          {
            isLook ? (
              <Table
                className="table"
                options={fromJS(devicesTableOptions).delete(-1)}
                list={this.props.defaultGroupDevices}
              />
            ) : (
              <div>
                <FormGroup
                  label={msg.groupname}
                  required={true}
                  value={this.getEditVal('groupname')}
                  maxLength="24"
                  id="groupname"
                  onChange={this.onChangeGroupSettings('groupname')}
                  {...groupname}
                />
                <FormGroup
                  label={msg.remarks}
                  required={true}
                  maxLength="64"
                  value={this.getEditVal('remark')}
                  id="remark"
                  onChange={this.onChangeGroupSettings('remark')}
                  {...remarks}
                />
                <Table
                  className="table"
                  options={fromJS(devicesTableOptions)}
                  list={this.props.devices.get('list')}
                  page={this.props.page}
                />
              </div>
            )
          }
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
    devices: myState.get('devices'),
    defaultGroupDevices: myState.get('defaultGroupDevices'),
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    validateActions,
    actions
  ), dispatch)
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(GroupSettings);

export const settings = reducer;

