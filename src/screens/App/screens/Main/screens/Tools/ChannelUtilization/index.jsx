import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  Button, FormGroup, Table,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';
import * as selfActions from './actions';
import reducer from './reducer';

let a;
let channelUtiOptions;
let channelUtiList;

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  fetchSettings: PropTypes.func,
  initSettings: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  changePerChannelScanTime: PropTypes.func,
  changeChannelLen: PropTypes.func,
  changeRemainTime: PropTypes.func,
  changeUtiTableShowStatus: PropTypes.func,
};

export default class ChannelUtilization extends React.Component {
  constructor(props) {
    super(props);
    this.onRunScanBtnClick = this.onRunScanBtnClick.bind(this);
    this.makeChannelUtiOptionsAndList = this.makeChannelUtiOptionsAndList.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
    });
    utils.fetch('goform/get_country_info')
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.props.changeChannelLen(json.data.channels.length);
          }
        });
  }

  componentWillUnmount() {
    clearInterval(a);
    this.props.changePerChannelScanTime(3);
    this.props.changeChannelLen(0);
    this.props.changeRemainTime(-1);
    this.props.changeUtiTableShowStatus(false);
  }

  onRunScanBtnClick() {
    const len = this.props.selfState.get('channelLen');
    const time = this.props.selfState.get('time');
    let n = len * time;
    this.props.changeRemainTime(n);
    a = setInterval(() => {
      if (n >= -1) {
        this.props.changeRemainTime(n--);
      } else {
        clearInterval(a);
      }
    }, 1000);
    utils.fetch('goform/get_chanutil')
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            const chutilList = json.data.chutilList;
            this.makeChannelUtiOptionsAndList(chutilList);
            this.props.changeUtiTableShowStatus(true);
          }
        });
  }

  makeChannelUtiOptionsAndList(utilList) {
    let mapList = fromJS({});
    channelUtiOptions = fromJS([
      {
        id: 'title',
        text: _('Channel'),
        transform() {
          return _('Utilization');
        },
      },
    ]);
    channelUtiList = fromJS([]);
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
  }

  render() {
    const { showTable, remainTime, channelLen, time } = this.props.selfState.toJS();
    return (
      <div>
        <h3>{_('Channel Utilization Survey')}</h3><br />
        <FormGroup>{_('Note: something you should know...')}</FormGroup>
        <FormGroup
          label={_('Per Channel Scan Time')}
          help="s"
          type="number"
          value={this.props.selfState.get('time')}
          onChange={(data) => this.props.changePerChannelScanTime(data.value)}
        />
        <FormGroup
          label={_('Scan Time Estimate')}
          type="plain-text"
          value={(channelLen * time) + 's'}
        />
        <FormGroup>
          <Button
            theme="primary"
            text={_('Run Test')}
            loading={remainTime !== -1}
            onClick={() => this.onRunScanBtnClick()}
          />
          {
            remainTime === -1 ? null : (
              <span>
                {_('Time Remain: ') + remainTime }
              </span>
            )
          }
        </FormGroup>
        {
          (remainTime === -1 && showTable) ? (
            <Table
              className="table"
              title={_('Channel Utilization:')}
              options={channelUtiOptions}
              list={channelUtiList}
            />
          ) : null
        }
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
