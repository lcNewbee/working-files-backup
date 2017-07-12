import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
// import EchartReact from 'shared/components/EchartReact';

import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';

const propTypes = {
  route: PropTypes.object,
  app: PropTypes.instanceOf(Map).isRequired,
  store: PropTypes.instanceOf(Map).isRequired,
  save: PropTypes.func,
  fetchScreenData: PropTypes.func,
};

export default class DPISettings extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'initFormOptions',
      'onChangeSettingData',
    ]);
  }
  componentDidMount() {
    this.initFormOptions(this.props);
  }

  componentWillUpdate(nextProps) {
    const curScreenId = this.props.store.get('curScreenId');
    const curVersion = this.props.app.get('version');
    const nextVersion = nextProps.app.get('version');
    const curEthNumber = this.props.store.getIn([curScreenId, 'data', 'settings', 'ethNumber']);
    const nextEthNumber = nextProps.store.getIn([curScreenId, 'data', 'settings', 'ethNumber']);

    if (curEthNumber !== nextEthNumber || curVersion !== nextVersion) {
      this.initFormOptions(nextProps);
    }
  }

  onChangeSettingData(data, val) {
    const payload = {
      action: 'active',
      active_eth: data.value,
      ethx_name: val.slice(0, 4),
    };
    this.props.save(this.props.route.formUrl, payload).then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.fetchScreenData({
          url: this.props.route.formUrl,
        });
      }
    });
  }

  initFormOptions(props) {
    const curScreenId = props.store.get('curScreenId');
    let defaultNumber = 4;
    let curEthNumber = props.store.getIn([curScreenId, 'data', 'settings', 'ethNumber']);

    if (props.app.get('version').indexOf('AXC3000') !== -1) {
      defaultNumber = 6;
    }
    if (!curEthNumber) {
      curEthNumber = defaultNumber;
    }
    this.$$formOptions = fromJS([
      {
        id: 'ndpiEnable',
        label: __('Application Analsys'),
        type: 'checkbox',
        value: '1',
        saveOnChange: true,
        // onChange: (data) => {
        //   const payload = {
        //     action: 'setting',
        //     ndpiEnable: data.value,
        //   };
        //   this.props.save(this.props.route.formUrl, payload).then((json) => {
        //     if (json.state && json.state.code === 2000) {
        //       this.props.fetchScreenData({
        //         url: this.props.route.formUrl,
        //       });
        //     }
        //   });
        // },
      },
      {
        id: 'eth0Enable',
        label: `ETH0 ${__('Active Status')}`,
        type: 'checkbox',
        value: '1',
        onChange: (data) => { this.onChangeSettingData(data, 'eth0Enable'); },
      },
      {
        id: 'eth1Enable',
        label: `ETH1 ${__('Active Status')}`,
        type: 'checkbox',
        value: '1',
        onChange: (data) => { this.onChangeSettingData(data, 'eth1Enable'); },
      },
      {
        id: 'eth2Enable',
        label: `ETH2 ${__('Active Status')}`,
        type: 'checkbox',
        value: '1',
        onChange: (data) => { this.onChangeSettingData(data, 'eth2Enable'); },
      },
      {
        id: 'eth3Enable',
        label: `ETH3 ${__('Active Status')}`,
        type: 'checkbox',
        value: '1',
        onChange: (data) => { this.onChangeSettingData(data, 'eth3Enable'); },
      },
      {
        id: 'eth4Enable',
        label: `ETH4 ${__('Active Status')}`,
        type: 'checkbox',
        value: '1',
        onChange: (data) => { this.onChangeSettingData(data, 'eth4Enable'); },
      },
      {
        id: 'eth5Enable',
        label: `ETH5 ${__('Active Status')}`,
        type: 'checkbox',
        value: '1',
        onChange: (data) => { this.onChangeSettingData(data, 'eth5Enable'); },
      },
    ]);

    if (parseInt(curEthNumber, 10) <= 4) {
      this.$$formOptions = this.$$formOptions.delete(-1).delete(-1);
    }
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={this.$$formOptions}
      />
    );
  }
}

DPISettings.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DPISettings);
