import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import {
  Button, FormGroup, FormInput, Modal, Table,
} from 'shared/components';
import { bindActionCreators } from 'redux';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';
import * as selfActions from './actions';
import selfReducer from './reducer';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetch: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,

  selfState: PropTypes.object,
  initSelfState: PropTypes.func,
  clickSpeedTestRunBtn: PropTypes.func,
  toggleShowAdvanceBtn: PropTypes.func,
  changeShowScanResults: PropTypes.func,
  changeSelectedIp: PropTypes.func,
};

const defaultProps = {};

export default class SpeedTest extends React.Component {

  constructor(props) {
    super(props);
    this.onSelectBtnClick = this.onSelectBtnClick.bind(this);
    this.onModalOkClick = this.onModalOkClick.bind(this);
    this.onModalCancelClick = this.onModalCancelClick.bind(this);
    this.onSelectScanResultItem = this.onSelectScanResultItem.bind(this);
    this.ceateIpTableList = this.ceateIpTableList.bind(this);
  }

  componentWillMount() {
    const props = this.props;

    props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      defaultData: {
        ip: '192.168.1.10',
        time: '30',
        direction: 'duplex',
      },
    });
    props.initSelfState();
    props.changeShowScanResults(false);
  }
  onSelectBtnClick() {
    this.props.fetch('goform/get_ip_list')
              .then((json) => {
                if (json.state && json.state.code === 2000) {
                  this.props.updateItemSettings({
                    ipList: fromJS(json.data.ipList),
                  });
                }
              });
    this.props.changeShowScanResults(true);
  }
  onModalOkClick() {
    const selectedIp = this.props.selfState.get('selectedIp');
    if (selectedIp !== '') {
      this.props.updateItemSettings({
        ip: this.props.selfState.get('selectedIp'),
        ipList: fromJS([]),
      });
      this.props.changeShowScanResults(false);
    }
    this.props.changeSelectedIp('');
  }

  onModalCancelClick() {
    this.props.changeShowScanResults(false);
    this.props.updateItemSettings({
      ipList: fromJS([]),
    });
    this.props.changeSelectedIp('');
  }

  onSelectScanResultItem(val, item) {
    const ip = item.get('ip');
    this.props.changeSelectedIp(ip);
  }
  ceateIpTableList() {
    const immutList = this.props.store.getIn(['curData', 'ipList']);
    const list = [];
    if (immutList !== undefined) {
      const ipList = immutList.toJS();
      for (const val of ipList) {
        list.push({ ip: val });
      }
    }
    return list;
  }
  render() {
    const {
      ip, username, password, port, time, direction,
    } = this.props.store.get('curData').toJS();
    const { showResults, showAdvance, bandwidth, rx, tx, total } = this.props.selfState.toJS();
    const scanIpOptions = fromJS([
      {
        id: 'action',
        text: _('Select'),
        width: '50',
        transform: function(val, item) {
          return (
            <FormInput
              type="radio"
              name="ipselection"
              onChange={() => this.onSelectScanResultItem(val, item)}
            />
          );
        }.bind(this),
      },
      {
        id: 'ip',
        text: _('IP'),
      },
    ]);
    return (
      <div>
        <div className="clearfix">
          <FormGroup
            className="fl"
            type="text"
            label={_('Destination IP')}
            value={ip}
            onChange={(data) => this.props.updateItemSettings({
              ip: data.value,
            })}
          />
          <Button
            className="fl"
            theme="default"
            text={_('Select')}
            onClick={this.onSelectBtnClick}
            style={{
              marginLeft: '4px',
              marginTop: '3px',
            }}
          />
        </div>
        {
          this.props.selfState.get('showScanResults') ? (
            <Modal
              cancelText={_('Cancel')}
              okText={_('OK')}
              onOk={this.onModalOkClick}
              onClose={this.onModalCancelClick}
              cancelButton
              okButton
              isShow
            >
              <Table
                className="table"
                options={scanIpOptions}
                list={this.ceateIpTableList()}
              />
            </Modal>
          ) : null
        }
        <FormGroup
          type="checkbox"
          label={_('Show Advanced Options')}
          value={showAdvance === '1'}
          onClick={this.props.toggleShowAdvanceBtn}
        />
        {
          (showAdvance === '1') ? (
            <div>
              <FormGroup
                type="radio"
                label={_('Direction')}
              >
                <FormInput
                  type="radio"
                  name="directionSelect"
                  text={_('duplex')}
                  checked={direction === '0'}
                  onChange={() => this.props.updateItemSettings({
                    direction: '0',
                  })}
                />
                <FormInput
                  type="radio"
                  name="directionSelect"
                  text={_('receive')}
                  checked={direction === '1'}
                  onChange={() => this.props.updateItemSettings({
                    direction: '1',
                  })}
                />
                <FormInput
                  type="radio"
                  name="directionSelect"
                  text={_('transmit')}
                  checked={direction === '2'}
                  onChange={() => this.props.updateItemSettings({
                    direction: '2',
                  })}
                />
              </FormGroup>
              <FormGroup
                type="number"
                label={_('Duration')}
                value={time}
                onChange={(data) => this.props.updateItemSettings({
                  time: data.value,
                })}
              />
            </div>
          ) : null
        }
        <FormGroup>
          <Button
            theme="primary"
            text={_('Run')}
            onClick={this.props.clickSpeedTestRunBtn}
          />
        </FormGroup>
        {
          (showResults === '1') ? (
            <div className="result">
              <FormGroup
                type="text"
                label={_('rx')}
                value={rx}
              />
              <FormGroup
                type="text"
                label={_('tx')}
                value={tx}
              />
              <FormGroup
                type="text"
                label={_('total')}
                value={total}
              />
            </div>
          ) : null
        }
      </div>
    );
  }
}

SpeedTest.propTypes = propTypes;
SpeedTest.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.speedtest,
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
)(SpeedTest);


export const speedtest = selfReducer;
