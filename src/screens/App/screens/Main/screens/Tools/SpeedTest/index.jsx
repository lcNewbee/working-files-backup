import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import {
  Button, FormGroup, FormInput, Modal, Table,
} from 'shared/components';
import validator from 'shared/utils/lib/validator';
import { bindActionCreators } from 'redux';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';
import * as selfActions from './actions';
import selfReducer from './reducer';

let a;
const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  validateAll: PropTypes.func,
  validateOption: PropTypes.object,

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
  changeTimeClock: PropTypes.func,
  changeQueryData: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  toggleShowResultBtn: PropTypes.func,
  changeStopWait: PropTypes.func,
  save: PropTypes.func,
  receiveTestResult: PropTypes.func,
};

const defaultProps = {};

const validOptions = Map({
  validIp: validator({
    rules: 'ip',
  }),
  validTime: validator({
    rules: 'num:[10, 300]',
  }),
});
export default class SpeedTest extends React.Component {

  constructor(props) {
    super(props);
    this.onSelectBtnClick = this.onSelectBtnClick.bind(this);
    this.onModalOkClick = this.onModalOkClick.bind(this);
    this.onModalCancelClick = this.onModalCancelClick.bind(this);
    this.onSelectScanResultItem = this.onSelectScanResultItem.bind(this);
    this.ceateIpTableList = this.ceateIpTableList.bind(this);
    this.onRunTest = this.onRunTest.bind(this);
  }

  componentWillMount() {
    const defaultData = {
      ip: '192.168.1.10',
      time: '30',
      direction: '0',
      pocketSize: '64',
    };
    const props = this.props;
    clearInterval(a);
    props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      defaultData,
    });
    props.initSelfState(defaultData);
    props.changeShowScanResults(false);
  }

  componentWillUnmount() {
    this.props.resetVaildateMsg();
    this.props.changeTimeClock('');
    clearInterval(a);
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

  onRunTest() {
    this.props.toggleShowResultBtn('0');
    this.props.changeStopWait(false);
    this.props.validateAll()
        .then(msg => {
          if (msg.isEmpty()) {
            // this.props.clickSpeedTestRunBtn();
            const query = this.props.store.get('curData').toJS();
            this.props.save('goform/bandwidth_test', query)
                .then((json) => {
                  if (json.state && json.state.code === 2000) {
                    this.props.receiveTestResult(json.data);
                    this.props.changeStopWait(true);
                    this.props.toggleShowResultBtn('1');
                    clearInterval(a);
                  } else if (json.state && json.state.code !== 2000) {
                    clearInterval(a);
                    this.props.changeTimeClock('Test failed !' + json.state.msg);
                  }
                });
            let clock = parseInt(this.props.store.getIn(['curData', 'time']), 10);
            this.props.changeTimeClock(clock);
            a = setInterval(() => {
              const timeStr = (clock--).toString();
              this.props.changeTimeClock(timeStr);
              if (clock === 0) {
                const txt = _('The test is not complete, please keep waiting...');
                this.props.changeTimeClock(txt);
                clearInterval(a);
              }
            }, 1000);
          }
        });
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
      ip, time, direction, pocketSize,
    } = this.props.store.get('curData').toJS();
    const {
      showResults, showAdvance, stopWait, rx, tx, total, query,
    } = this.props.selfState.toJS();
    const { validIp, validTime } = this.props.validateOption;
    const scanIpOptions = fromJS([
      {
        id: 'action',
        text: _('Select'),
        width: '50',
        transform: function (val, item) {
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
      <div className="o-form">
        <div className="o-form__legend">{_('Speed Test')}</div>
        <div className="clearfix">
          <FormGroup
            className="fl"
            type="text"
            label={_('Destination IP')}
            value={ip}
            onChange={(data) => this.props.updateItemSettings({
              ip: data.value,
            })}
            required
            {...validIp}
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
          type="radio"
          label={_('Flow Direction')}
        >
          <FormInput
            type="radio"
            name="directionSelect"
            text={_('Duplex')}
            checked={direction === '0'}
            onChange={() => this.props.updateItemSettings({
              direction: '0',
            })}
          />
          <FormInput
            type="radio"
            name="directionSelect"
            text={_('Receive')}
            checked={direction === '1'}
            onChange={() => this.props.updateItemSettings({
              direction: '1',
            })}
          />
          <FormInput
            type="radio"
            name="directionSelect"
            text={_('Transmit')}
            checked={direction === '2'}
            onChange={() => this.props.updateItemSettings({
              direction: '2',
            })}
          />
        </FormGroup>
        <div className="o-form__legend">{_('Bandwidth Status')}</div>
        <FormGroup>
          <div
            className="stats-group clearfix"
            style={{
              width: '180px',
            }}
          >
            <div className="stats-group-cell fl">
              <div>{rx + 'Mbps'}</div>
              <div>{_('Download')}</div>
            </div>
            <div className="stats-group-cell fr">
              <div>{tx + 'Mbps'}</div>
              <div>{_('Upload')}</div>
            </div>
          </div>
          <div>
            <Button
              theme="primary"
              text={_('Run Test')}
              // loading={this.props.selfState.get('time') !== ''}
              // disabled={stopWait}
              onClick={this.onRunTest}
            />
            <Button
              theme="primary"
              text={_('Advanced Options')}
              onClick={() => {
                const pQuery = {
                  time,
                  pocketSize,
                };
                this.props.changeQueryData(pQuery);
                this.props.toggleShowAdvanceBtn();
              }}
            />
          </div>
        </FormGroup>
        {// 测速高级配置弹出页面
          (showAdvance === '1') ? (
            <Modal
              isShow
              title={_('Advanced Settings')}
              onClose={() => {
                const pQuery = {
                  time,
                  pocketSize,
                };
                this.props.changeQueryData(pQuery);
                this.props.toggleShowAdvanceBtn();
              }}
              onOk={() => {
                this.props.validateAll()
                    .then(() => {
                      this.props.updateItemSettings(query);
                      this.props.toggleShowAdvanceBtn();
                    });
              }}
            >
              <FormGroup
                type="number"
                label={_('Pocket Size')}
                value={this.props.selfState.getIn(['query', 'pocketSize'])}
                onChange={(data) => {
                  const pQuery = this.props.selfState.get('query').set('pocketSize', data.value);
                  this.props.changeQueryData(pQuery);
                }}
              />
              <FormGroup
                type="number"
                label={_('Test Duration')}
                value={this.props.selfState.getIn(['query', 'time'])}
                onChange={(data) => {
                  const pQuery = this.props.selfState.get('query').set('time', data.value);
                  this.props.changeQueryData(pQuery);
                }}
                required
                {...validTime}
              />
            </Modal>
          ) : null
        }
        {// 测试过程中提示用户等待的弹出页面
          !stopWait ? (
            <Modal
              size="lg"
              title="ceshi"
              noFooter
              isShow
              onClose={() => {
                this.props.save('goform/stop_bandwidth_test')
                    .then((json) => {
                      if (json.state && json.state.code === 2000) {
                        this.props.changeStopWait(true);
                        clearInterval(a);
                      }
                    });
              }}
            >
              {
                /[0-9]+/.test(this.props.selfState.get('time')) ? (
                  <span>{_('Time Remain: ') + this.props.selfState.get('time') + 's'}</span>
                ) : (
                  <span>{this.props.selfState.get('time')}</span>
                )
              }
            </Modal>
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
  validator.mergeProps(validOptions)
)(SpeedTest);


export const speedtest = selfReducer;
