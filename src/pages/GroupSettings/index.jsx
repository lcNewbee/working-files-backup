import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {FormGruop} from '../../components/form/Input';
import {Table} from '../../components/Table';
import * as actions from './actions';
import reducer from './reducer';
import Modal from '../../components/Modal';
import {fromJS} from 'immutable';

// 原生的 react 页面
export const Settings = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.props.fetchDeviceGroups();
  },

  onAddGroup() {
    this.props.addDeviceGroups();
  },

  onEditGroup(e) {
     var id = e.target.id;

     this.props.editDeviceGroups(id);
  },

  onDeleteGroup(e) {
    var id = e.target.id;

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
            <button
              onClick={this.onEditGroup}
              className="btn btn-info"
              id={item.get('id')}
            >
              修改
            </button>

            <button
              className="btn btn-warning"
              onClick={this.onDeleteGroup}
              id={item.get('id')}
            >
              删除
            </button>
          </div>
        )
      }.bind(this)
    }];

    return (
      <div>

        <Table
          className="table"
          options={fromJS(groupTableOptions)}
          list={this.props.data.get('list')}
        />

        <button
          type="button"
          className="btn fr"
          onClick={this.onAddGroup}
        >
          添加
        </button>

        <Modal
          isShow={this.props.data.get('edit')}
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
            options={fromJS(groupTableOptions)}
            list={this.props.data.get('list')}
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
    data: myState.get('data')
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Settings);

export const settings = reducer;

