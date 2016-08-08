import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import * as actions from './actions';
import * as appActions from 'shared/actions/app';
import myReducer from './reducer';

// components
import {Table} from 'shared/components/Table';
import Button from 'shared/components/Button';
import {Search, FormGroup, Checkbox} from 'shared/components/Form';
import Select from 'shared/components/Select';
import Modal from 'shared/components/Modal';
import Switchs from 'shared/components/Switchs';

const msg = {
  delete: _('Delete'),
  edit: _('Edit'),
  look: _('View'),
  add: _('Add')
}

const validOptions = fromJS({
  mainIp: validator({
    rules: 'ip'
  }),
  mainMask: validator({
    rules: 'mask'
  }),
  secondIp: validator({
    rules: 'url'
  }),
  secondMask: validator({
    rules: 'required'
  }),
  ipv6: validator({
    rules: 'required'
  })
});

let DhcpAddressPoolTableOption = fromJS([
  {
    id: 'name',
    text: _('Name'),
  }, {
    id: 'type',
    text: _('Type'),
  }, {
    id: 'domain',
    text: _('Domain'),
  }, {
    id: 'startIp',
    text: _('Start IP'),
  }, {
    id: 'endIp',
    text: _('End IP'),
  }, {
    id: 'mask',
    text: _('Mask'),
  }, {
    id: 'gateway',
    text: _('Gateway'),
  }, {
    id: 'mainDns',
    text: _('Main DNS'),
  }, {
    id: 'secondDns',
    text: _('Second DNS'),
  }, {
    id: 'releaseTime',
    text: _('Release Time'),
  }, {
    id: 'op',
    text: _('Actions'),
  }
]);


export default class View extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSelectDhcpAddressPool = this.onSelectDhcpAddressPool.bind(this);
  };

  componentWillMount() {
    this.props.fetchDhcpAddressPoolList()
  }

  onChangeEditData(key, data) {
    const changeData = {};

    changeData[key] = data.value;

    this.props.updateDhcpAddressPoolEdit(changeData)
  }

  onDeleteDhcpAddressPool(item) {
    let msg_text = '';

    if(item) {
      msg_text = _('Are you sure delete address pool: %s?', item.get('name'));
    } else {
      msg_text = _('Are you sure delete selected address pools?');
    }

    this.props.createModal({
      id: 'interfaceSettings',
      role: 'comfirm',
      text: msg_text,
      apply: function() {

      }.bind(this)
    });
  }

  onSelectDhcpAddressPool(data) {
    this.props.selectDhcpAddressPool(data)
  }

  render() {
    const editData = this.props.store.get('edit');
    let modalTitle = editData.get('name');

    DhcpAddressPoolTableOption = DhcpAddressPoolTableOption.set(-1, fromJS({
      id: 'op',
      text: _('Actions'),
      width: '180',
      transform: function (val, item) {
        return (
          <div className="action-btns">
            <Button
              icon="edit"
              text="修改"
              size="sm"
              onClick={() => {
                this.props.editDhcpAddressPool(item.get('name'))
              }}
            />
            <Button
              icon="trash"
              size="sm"
              text="删除"
              onClick={() => {
                this.onDeleteDhcpAddressPool(item)
              }}
            />
          </div>
        )
      }.bind(this)
    }));

    if(this.props.store.get('actionType') === 'add') {
      modalTitle = msg.add;
    } else if (this.props.store.get('actionType') === 'edit') {
      modalTitle = msg.edit + ' ' + modalTitle;
    }

    return (
      <div>
        <h3 className="t-main__content-title">{_('DHCP Settings')}</h3>
        <div className="m-action-bar">

          <div className="m-action-bar__left action-btns">
            <Button
              icon="plus"
              role="primary"
              onClick={this.props.addDhcpAddressPool}
              text="添加"
            />
            <Button
              icon="trash"
              text="删除"
              onClick={() => {
                this.onDeleteDhcpAddressPool()
              }}
            />
          </div>
        </div>

        <Table
          className="table"
          options={DhcpAddressPoolTableOption}
          list={this.props.store.getIn(['data', 'list'])}
          selectAble
          onSelectRow={this.onSelectDhcpAddressPool}
        />

        <Modal
          isShow={editData.isEmpty() ? false : true}
          title={modalTitle}
          onClose={this.props.closeDhcpAddressPoolEdit}
          onOk={this.onSaveDhcpAddressPool}
        >
          <FormGroup
            type="text"
            value={editData.get('name')}
            label={_('Address Pool Name')}
            maxLength="24"
            onChange={(data) => {
              this.onChangeEditData('name', data);
            }}
          />
          <FormGroup
            type="checkbox"
            label={_('Address Pool Type') }
          >
            <Switchs
              value={editData.get('type')}
              options={[
                {
                  value: 'ipv4',
                  label: 'IPV4'
                }, {
                  value: 'ipv6',
                  label: 'IPV6'
                }
              ]}
              onChange={(data) => {
                this.onChangeEditData('type', data);
              }}
            />
          </FormGroup>
          <FormGroup
            type="text"
            value={editData.get('domain')}
            label={_('Domain')}
            onChange={(data) => {
              this.onChangeEditData('domain', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('startIp')}
            label={_('Start IP')}
            onChange={(data) => {
              this.onChangeEditData('startIp', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('endIp')}
            label={_('End IP')}
            onChange={(data) => {
              this.onChangeEditData('endIp', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('mask')}
            label={_('Mask')}
            onChange={(data) => {
              this.onChangeEditData('mask', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('gateway')}
            label={_('Gateway')}
            onChange={(data) => {
              this.onChangeEditData('gateway', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('mainDns')}
            label={_('Main DNS')}
            onChange={(data) => {
              this.onChangeEditData('mainDns', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('secondDns')}
            label={_('Second DNS')}
            onChange={(data) => {
              this.onChangeEditData('secondDns', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('releaseTime')}
            label={_('Release Time')}
            onChange={(data) => {
              this.onChangeEditData('releaseTime', data);
            }}
          />
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.dhcpAdressPool,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(View);

export const reducer = myReducer;
