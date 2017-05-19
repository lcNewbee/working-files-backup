import React from 'react'; import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
// import EchartReact from 'shared/components/EchartReact';

import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';

const propTypes = fromJS({
  route: PropTypes.object,
  initScreen: PropTypes.func,
});

export default class EthStatistic extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'initFormOptions',
      'onChangeSettingData',
    ]);
  }

  onChangeSettingData(data, val) {
    const payload = {
      action: 'active',
      active_eth: data.value,
      ethx_name: val.slice(0, 4),
    };
    this.props.save(this.props.route.formUrl, payload).then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.fetchScreenData();
      }
    });
  }

  initFormOptions() {
    this.$$formOptions = fromJS([
      {
        id: 'ndpiEnable',
        label: __('Application Analyze'),
        type: 'checkbox',
        saveOnChange: true,
        // onChange: (data) => {
        //   const payload = {
        //     action: 'setting',
        //     ndpiEnable: data.value,
        //   };
        //   this.props.save(this.props.route.formUrl, payload).then((json) => {
        //     if (json.state && json.state.code === 2000) {
        //       this.props.fetchScreenData();
        //     }
        //   });
        // },
      },
      {
        id: 'eth0Enable',
        label: `ETH0 ${__('Active Status')}`,
        type: 'checkbox',
        onChange: (data) => { this.onChangeSettingData(data, 'eth0Enable'); },
      },
      {
        id: 'eth1Enable',
        label: `ETH1 ${__('Active Status')}`,
        type: 'checkbox',
        onChange: (data) => { this.onChangeSettingData(data, 'eth1Enable'); },
      },
      {
        id: 'eth2Enable',
        label: `ETH2 ${__('Active Status')}`,
        type: 'checkbox',
        onChange: (data) => { this.onChangeSettingData(data, 'eth2Enable'); },
      },
      {
        id: 'eth3Enable',
        label: `ETH3 ${__('Active Status')}`,
        type: 'checkbox',
        onChange: (data) => { this.onChangeSettingData(data, 'eth3Enable'); },
      },
      {
        id: 'eth4Enable',
        label: `ETH4 ${__('Active Status')}`,
        type: 'checkbox',
        onChange: (data) => { this.onChangeSettingData(data, 'eth4Enable'); },
      },
      {
        id: 'eth5Enable',
        label: `ETH5 ${__('Active Status')}`,
        type: 'checkbox',
        onChange: (data) => { this.onChangeSettingData(data, 'eth5Enable'); },
      },
    ]);
    if (this.props.app.get('version').indexOf('AXC1000') !== -1) {
      this.formOptions = this.$$formOptions.delete(-1).delete(-1);
    }

    return this.$$formOptions;
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={this.initFormOptions()}
      />
    );
  }
}

EthStatistic.propTypes = propTypes;

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
)(EthStatistic);
