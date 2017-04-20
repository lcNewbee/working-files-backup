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
  fetch: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  updateItemSettings: PropTypes.func,

};

const defaultProps = {};

export default class PortSettings extends React.Component {

  constructor(props) {
    super(props);
    this.renderEnableBtn = this.renderEnableBtn.bind(this);
    this.renderTypeSelector = this.renderTypeSelector.bind(this);
    this.renderVlanIdInput = this.renderVlanIdInput.bind(this);
  }

  componentWillMount() {
    this.props.fetch('goform/get_port_vlan').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.updateItemSettings(fromJS(json.data));
      }
    });
  }

  renderEnableBtn(val, item) {
    if (val === '0' || val === '1') {
      return (
        <FormInput
          type="checkbox"
          checked={val === '1'}
          onChange={(data) => {
            const portList = this.props.store.getIn(['curData', 'portList']);
            const index = portList.indexOf(item);
            portList.setIn([index, 'enable'], data.value);
            this.props.updateItemSettings({ portList });
          }}
        />
      );
    }
    return null;
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
        onChange={(data) => {
          const portList = this.props.store.getIn(['curData', 'portList']);
          const index = portList.indexOf(item);
          portList.setIn([index, 'type'], data.value);
          this.props.updateItemSettings({ portList });
        }}
      />
    );
  }

  renderVlanIdInput(val, item) {
    const type = item.get('type');
    return (
      <span>
        <span>
          {
            type === 'trunk' ? __('Untag ID') : __('Vlan ID')
          }
          <FormInput
            type="number"
            value={val}
            min="1"
            max="4094"
            onChange={(data) => {
              const portList = this.props.store.getIn(['curData', 'portList']);
              const index = portList.indexOf(item);
              portList.setIn([index, 'vlanId'], data.value);
              this.props.updateItemSettings({ portList });
            }}
          />
        </span>
      </span>
    );
  }

  render() {
    const that = this;
    const portList = this.props.store.getIn(['curData', 'portList']);
    const listOptions = fromJS([
      {
        id: 'name',
        text: __('Name'),
      },
      {
        id: 'enable',
        text: __('Enable'),
        transform: val => that.renderEnableBtn(val),
      },
      {
        id: 'type',
        text: __('Type'),
        transform: val => that.renderTypeSelector(val),
      },
      {
        id: 'vlanId',
        text: __('VLAN ID'),
        transform: (val, item) => that.renderVlanIdInput(val, item),
      },
    ]);
    return (
      <div>
        <Table
          options={listOptions}
          list={portList}
        />
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
