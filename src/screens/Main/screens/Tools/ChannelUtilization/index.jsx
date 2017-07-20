import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { Button, FormGroup, Table } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as sharedActions } from 'shared/containers/settings';
import * as selfActions from './actions';
import reducer from './reducer';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  fetch: PropTypes.func,
  fetchSettings: PropTypes.func,
  initSettings: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  changeChannelUtiList: PropTypes.func,
  changeChannelUtiOptions: PropTypes.func,
  changeUtiTableShowStatus: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
};

export default class ChannelUtilization extends React.Component {
  constructor(props) {
    super(props);
    this.onRunScanBtnClick = this.onRunScanBtnClick.bind(this);
    this.makeChannelUtiOptionsAndList = this.makeChannelUtiOptionsAndList.bind(this);
    this.getDataAndRenderTable = this.getDataAndRenderTable.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
    });
    this.getDataAndRenderTable();
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }

  onRunScanBtnClick() {
    this.getDataAndRenderTable();
  }

  getDataAndRenderTable() {
    this.props.fetch('goform/get_chanutil').then((json) => {
      if (json.state && json.state.code === 2000) {
        const chutilList = json.data.chutilList;
        const list = this.makeChannelUtiOptionsAndList(chutilList);
        this.props.changeChannelUtiOptions(list.get('channelUtiOptions'));
        this.props.changeChannelUtiList(list.get('channelUtiList'));
      }
    });
  }

  makeChannelUtiOptionsAndList(utilList) {
    let mapList = fromJS({});
    let channelUtiOptions = fromJS([
      {
        id: 'title',
        text: __('Channel'),
        render() {
          return __('Utilization');
        },
      },
    ]);
    let channelUtiList = fromJS([]);
    utilList.forEach((val) => {
      const name = val.channel;
      const value = val.utilization;
      channelUtiOptions = channelUtiOptions.push(fromJS({
        id: name,
        text: name,
      }));
      mapList = mapList.set(name, value);
    });
    channelUtiList = channelUtiList.push(mapList);

    return fromJS({}).set('channelUtiOptions', channelUtiOptions)
                    .set('channelUtiList', channelUtiList);
  }

  render() {
    // const { channelUtiOptions, channelUtiList } = this.props.selfState.toJS();
    return (
      <div className="stats-group">
        <h3>{__('Channel Utilization Survey')}</h3><br />
        <div className="stats-group-cell">
          <Table
            className="table"
            title={__('Channel Utilization:')}
            options={this.props.selfState.get('channelUtiOptions')}
            list={this.props.selfState.get('channelUtiList')}
          />
        </div>
        <div
          style={{
            margin: '10px 0 10px 30px',
          }}
        >
          <Button
            theme="primary"
            text={__('Run Test')}
            onClick={() => this.onRunScanBtnClick()}
          />
        </div>
      </div>
    );
  }
}

ChannelUtilization.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.channelutilization,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelUtilization);

export const channelutilization = reducer;
