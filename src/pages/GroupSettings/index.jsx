import React from 'react';
import { bindActionCreators } from 'redux';
import {fromJS} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import {fetchDevices} from '../Devices/actions';
import reducer from './reducer';
import Modal from '../../components/Modal';
import {FormGruop} from '../../components/Form/Input';
import {Table} from '../../components/Table';
import Button from 'comlan/components/Button';

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

  onEditGroup(id) {
     this.props.editDeviceGroups(id);
  },

  onDeleteGroup(id) {

    if(confirm('你确定要删除？')) {
      this.props.deleteDeviceGroups(id)
    }
  },

  render() {
    var groupTableOptions = [{
      'id': 'name',
      'text': '组名称'
    }, {
      'id': 'remarks',
      'text': '备注'
    }, {
      'id': 'devices',
      'text': '设备列表'
    }, {
      'id': 'op',
      'text': '操作',
      transform: function(item) {
        return (
          <div>
            <Button
              onClick={this.onEditGroup.bind(this, item.get('id'))}
              role="edit"
              text="修改"
              size="sm"
            />

            <Button
              id={item.get('id')}
              role="trash"
              onClick={this.onDeleteGroup.bind(this, item.get('id'))}
              text="删除"
              size="sm"
            />
              
          </div>
        )
      }.bind(this)
    }];
    
    var devicesTableOptions = [{
        'id': 'name',
        'text': ' 设备名称'
      }, {
        'id': 'addr',
        'text': '地址'
      }, {
        'id': 'status',
        'text': '状态'
      }, {
        'id': 'op',
        'text': '选择',
        transform: function(item) {
          return (
            <div>
              <input type="checkbox" value="2" />
            </div>
          )
        }.bind(this)
      }];
    console.log(1)

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
          text="添加"
        />
          
        <Modal
          isShow={this.props.data.get('edit') ? true : false}
          title={"修改组" + this.props.data.getIn(['edit', 'name'])}
          onClose={this.props.removeEditDeviceGroups}
        >
          <FormGruop
            label="组名称"
            value={this.props.data.getIn(['edit', 'name'])}
          />
          <FormGruop
            label="备注"
            value={this.props.data.getIn(['edit', 'remarks'])}
          />
          <Table
            className="table"
            options={fromJS(devicesTableOptions)}
            list={this.props.devices}
          />
        </Modal>
      </div>
    );
  }
});

//React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  var myState = state.groupSettings;
  var devices = state.devices.getIn(['data', 'list'])

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    devices
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

