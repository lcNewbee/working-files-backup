import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  SaveButton, FormGroup, FormInput, Table,
} from 'shared/components';
import Modal from 'shared/components/Modal';
import ProgressBar from 'shared/components/ProgressBar';
import validator from 'shared/validator';
import { actions as appActions } from 'shared/containers/app';
import { actions as sharedActions } from 'shared/containers/settings';
import * as selfActions from './actions';
import reducer from './reducer';

// 可配置功能项
/**
network: {
  router: false, // 是否有router模式
},
 */

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,
  fetch: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  updateItemSettings: PropTypes.func,
  createModal: PropTypes.func,
};

const defaultProps = {};

export default class PortSettings extends React.Component {
  constructor(props) {
    super(props);
    this.renderEnableBtn = this.renderEnableBtn.bind(this);
    this.renderTypeSelector = this.renderTypeSelector.bind(this);
    this.renderVlanIdInput = this.renderVlanIdInput.bind(this);
    this.renderMembersInput = this.renderMembersInput.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    props.initSettings({
      settingId: props.route.id,
      formUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      defaultData: {
      },
    });
    props.fetch('goform/get_port_vlan').then((json) => {
      if (json.state && json.state.code === 2000) {
        props.updateItemSettings(fromJS(json.data));
      }
    });
  }

  onSave() {
    const portList = this.props.store.getIn(['curData', 'portList']);
    let flag = true;
    portList.every((item) => {
      const startvlan = item.getIn(['members', '0']);
      const endvlan = item.getIn(['members', '1']);
      if (startvlan > endvlan) {
        this.props.createModal({
          role: 'alert',
          text: __('Start member id should not be greater than the end! Check %s Members setting.', item.get('name')),
        });
        flag = false;
        return false;
      }
      return true;
    });
    if (flag) {
      this.props.save(this.props.route.saveUrl, { portList });
    }
  }

  renderEnableBtn(val, item) {
    if (val === '0' || val === '1') {
      return (
        <FormInput
          type="checkbox"
          checked={val === '1'}
          onChange={(data) => {
            let portList = this.props.store.getIn(['curData', 'portList']);
            const index = portList.indexOf(item);
            portList = portList.setIn([index, 'enable'], data.value);
            this.props.updateItemSettings({ portList });
          }}
        />
      );
    }
    return (
      <FormInput
        type="checkbox"
        checked
        disabled
      />
    );
  }

  renderTypeSelector(val, item) {
    return (
      <FormInput
        type="select"
        value={val}
        options={[
          { label: 'Trunk', value: 'trunk' },
          { label: 'Access', value: 'access' },
        ]}
        size="min"
        onChange={(data) => {
          let portList = this.props.store.getIn(['curData', 'portList']);
          const index = portList.indexOf(item);
          portList = portList.setIn([index, 'type'], data.value);
          this.props.updateItemSettings({ portList });
        }}
      />
    );
  }

  renderVlanIdInput(val, item) {
    const type = item.get('type');
    return (
      <div>
        <span
          style={{
            textAlign: 'right',
            marginRight: '15px',
            display: 'inline-block',
            width: '50px',
          }}
        >
          {type === 'trunk' ? __('Untag ID') : __('Vlan ID')}
        </span>
        <FormInput
          type="number"
          value={val}
          min="1"
          max="4094"
          onChange={(data) => {
            let portList = this.props.store.getIn(['curData', 'portList']);
            const index = portList.indexOf(item);
            portList = portList.setIn([index, 'vlanId'], data.value);
            this.props.updateItemSettings({ portList });
          }}
        />
      </div>
    );
  }

  renderMembersInput(val, item) {
    return (
      <div>
        <FormInput
          type="number"
          value={val.get('0')}
          min="1"
          max="4094"
          onChange={(data) => {
            let portList = this.props.store.getIn(['curData', 'portList']);
            const index = portList.indexOf(item);
            portList = portList.setIn([index, 'members', '0'], data.value);
            this.props.updateItemSettings({ portList });
          }}
        />
        <span> - </span>
        <FormInput
          type="number"
          value={val.get('1')}
          min="1"
          max="4094"
          onChange={(data) => {
            let portList = this.props.store.getIn(['curData', 'portList']);
            const index = portList.indexOf(item);
            portList = portList.setIn([index, 'members', '1'], data.value);
            this.props.updateItemSettings({ portList });
          }}
        />
      </div>
    );
  }

  render() {
    const that = this;
    const portList = this.props.store.getIn(['curData', 'portList']);
    const listOptions = fromJS([
      {
        id: 'name',
        text: __('Name'),
        width: '200px',
      },
      {
        id: 'enable',
        text: __('Enable'),
        render: (val, item) => that.renderEnableBtn(val, item),
        width: '200px',
      },
      {
        id: 'type',
        text: __('Type'),
        render: (val, item) => that.renderTypeSelector(val, item),
        width: '300px',
        paddingLeft: '90px',
      },
      {
        id: 'vlanId',
        text: __('VLAN ID'),
        render: (val, item) => that.renderVlanIdInput(val, item),
        wdith: '200px',
        paddingLeft: '30px',
      },
      {
        id: 'members',
        text: __('Members'),
        render: (val, item) => that.renderMembersInput(val, item),
        wdith: '200px',
        paddingLeft: '40px',
      },
    ]);
    return (
      <div className="o-box">
        <h3 className="o-box__cell">{__('Port Vlan Settings')}</h3>
        <div className="o-box__cell">
          <Table
            options={listOptions}
            list={portList}
          />
        </div>
        <div className="o-box__cell">
          <SaveButton
            type="button"
            loading={this.props.app.get('saving')}
            onClick={this.onSave}
          />
        </div>
      </div>
    );
  }
}

PortSettings.propTypes = propTypes;
PortSettings.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.portsettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PortSettings);

export const portsettings = reducer;
