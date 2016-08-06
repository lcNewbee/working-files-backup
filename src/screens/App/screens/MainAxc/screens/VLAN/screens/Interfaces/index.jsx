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
import Table from 'shared/components/Table';
import Button from 'shared/components/Button';
import {Search, FormGroup, Checkbox} from 'shared/components/Form';
import Select from 'shared/components/Select';
import Modal from 'shared/components/Modal';
import Switchs from 'shared/components/Switchs';

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

let InterfaceTableOption = fromJS([
  {
    id: 'id',
    text: _('No'),
  }, {
    id: 'status',
    text: _('Status'),
  }, {
    id: 'arpProxy',
    text: _('ARP Proxy'),
  }, {
    id: 'mainIp',
    text: _('Main IPV4'),
  }, {
    id: 'mainMask',
    text: _('Main IPV4 Mask'),
  }, {
    id: 'secondIp',
    text: _('Second IPV4'),
  }, {
    id: 'secondMask',
    text: _('Second IPV4 Mask'),
  }, {
    id: 'description',
    text: _('Description'),
  }, {
    id: 'op',
    text: _('Actions'),
  }
]);


export default class View extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  };

  onChangeEditData(key, data) {
    const changeData = {};

    changeData[key] = data.value;

    this.props.updateInterfaceEdit(changeData)
  }

  onDeleteInterface(item) {
    var msg_text = _('Are you sure delete interface: %s?', item.get('id'));

    this.props.createModal({
      id: 'interfaceSettings',
      role: 'comfirm',
      text: msg_text,
      apply: function() {

      }.bind(this)
    });
  }

  render() {
    const editData = this.props.interfaces.get('edit');
    InterfaceTableOption = InterfaceTableOption.set(-1, fromJS({
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
                this.props.editInterface(item.get('id'))
              }}
            />
            <Button
              icon="trash"
              size="sm"
              text="删除"
              onClick={() => {
                this.onDeleteInterface(item)
              }}
            />
          </div>
        )
      }.bind(this)
    }));

    return (
      <div>
        <h3 className="t-main__content-title">{_('Interface Settings')}</h3>
        <div className="m-action-bar">

          <div className="m-action-bar__left action-btns">
            <Button
              icon="plus"
              role="primary"
              onClick={this.props.addInterface}
              text="添加"
            />
            <Button
              icon="trash"
              text="删除"
            />
          </div>
        </div>

        <Table
          className="table"
          options={InterfaceTableOption}
          list={this.props.interfaces.get('list')}
        />

        <Modal
          isShow={editData.isEmpty() ? false : true}
          title={editData.get('id')}
          onClose={this.props.closeInterfacesEdit}
          onOk={this.onSaveInterfaces}
        >
          <FormGroup
            type="text"
            value={editData.get('id')}
            label={_('Interface No')}
            maxLength="24"
            disabled
          />
          <FormGroup
            type="checkbox"
            label={_('Interface Status') }
          />
          <FormGroup
            type="checkbox"
            label={_('Enable ARP Proxy')}
          />
          <FormGroup
            type="text"
            value={editData.get('mainIp')}
            label={_('Main IPV4')}
            onChange={(data) => {
              this.onChangeEditData('mainIp', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('mainMask')}
            label={_('Main IPV4 Mask')}
            onChange={(data) => {
              this.onChangeEditData('mainMask', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('secondIp')}
            label={_('Second IPV4')}
            onChange={(data) => {
              this.onChangeEditData('mainMask', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('secondMask')}
            label={_('Second IPV4 Mask')}
            onChange={(data) => {
              this.onChangeEditData('secondMask', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('ipv6')}
            label={_('IPV6')}
            onChange={(data) => {
              this.onChangeEditData('ipv6', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('ipv6Mask')}
            label={_('IPV6 Mask')}
            onChange={(data) => {
              this.onChangeEditData('ipv6Mask', data);
            }}
          />
          <FormGroup
            type="text"
            value={editData.get('description')}
            label={_('Description')}
            onChange={(data) => {
              this.onChangeEditData('description', data);
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
    interfaces: state.interfaces,
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
