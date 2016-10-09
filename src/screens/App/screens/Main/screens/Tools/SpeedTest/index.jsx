import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import {
  Button, FormGroup, FormInput, Modal, Table, SaveButton,
} from 'shared/components';
import ReactEchart from 'shared/components/EchartReact';
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

const initDefaultData = {
  ip: '192.168.1.10',
  time: '30',
  direction: '0',
};

export default class SpeedTest extends React.Component {

  constructor(props) {
    super(props);
    this.onSelectBtnClick = this.onSelectBtnClick.bind(this);
    this.onModalOkClick = this.onModalOkClick.bind(this);
    this.onModalCancelClick = this.onModalCancelClick.bind(this);
    this.onSelectScanResultItem = this.onSelectScanResultItem.bind(this);
    this.ceateIpTableList = this.ceateIpTableList.bind(this);
    this.makeXAxisData = this.makeXAxisData.bind(this);
    // this.onRunTest = this.onRunTest.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    clearInterval(a);
    props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      defaultData: initDefaultData,
    });
    props.initSelfState();
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
  makeXAxisData(n) {
    const data = [];
    for (let i = 1; i <= 2 * n; i++) {
      if (i % 60 === 0) {
        data.push((i / 120).toFixed(1) + 'm');
      } else {
        data.push('');
      }
    }
    console.log('data', data.length);
    return data;
  }
  /*
  onRunTest() {
    this.props.toggleShowResultBtn('0');
    this.props.validateAll()
        .then(msg => {
          if (msg.isEmpty()) {
            this.props.clickSpeedTestRunBtn();
            let clock = parseInt(this.props.store.getIn(['curData', 'time']), 10);
            this.props.changeTimeClock(clock);
            a = setInterval(() => {
              const timeStr = (clock--).toString();
              this.props.changeTimeClock(timeStr);
              if (clock === 0) {
                this.props.changeTimeClock('');
                this.props.toggleShowResultBtn('1');
                clearInterval(a);
              }
            }, 1000);
          }
        });
  }
  */

  render() {
    const {
      ip, username, password, port, time, direction,
    } = this.props.store.get('curData').toJS();
    const { showResults, showAdvance, bandwidth, rx, tx, total } = this.props.selfState.toJS();
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
    const chartOption = {
      backgroundColor: '#1b1b1b',
      tooltip: {
        formatter: '{a} <br/>{c} {b}',
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: '速度',
          type: 'gauge',
          min: 0,
          max: 10,
          splitNumber: 2,
          radius: '50%',
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
              width: 3,
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          axisLabel: {            // 坐标轴小标记
            textStyle: {       // 属性lineStyle控制线条样式
              fontWeight: 'bolder',
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          axisTick: {            // 坐标轴小标记
            length: 15,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          splitLine: {           // 分隔线
            length: 25,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 3,
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          pointer: {           // 分隔线
            shadowColor: '#fff', // 默认透明
            shadowBlur: 5,
          },
          title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 20,
              fontStyle: 'italic',
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff', // 默认透明
            shadowBlur: 5,
            offsetCenter: [0, '50%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
            },
          },
          data: [{ value: 0, name: '(TOTAL) Mb/s' }],
        },
        {
          name: '速度',
          type: 'gauge',
          center: ['25%', '55%'],    // 默认全局居中
          radius: '30%',
          min: 0,
          max: 8,
          endAngle: 45,
          splitNumber: 4,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.29, 'lime'], [0.86, '#1e90ff'], [1, '#ff4500']],
              width: 2,
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          axisLabel: {            // 坐标轴小标记
            textStyle: {       // 属性lineStyle控制线条样式
              fontWeight: 'bolder',
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          axisTick: {            // 坐标轴小标记
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          splitLine: {           // 分隔线
            length: 20,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 3,
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          pointer: {
            width: 5,
            shadowColor: '#fff', // 默认透明
            shadowBlur: 5,
          },
          title: {
            offsetCenter: [0, '-30%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontStyle: 'italic',
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          detail: {
                // backgroundColor: 'rgba(30,144,255,0.8)',
               // borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff', // 默认透明
            shadowBlur: 5,
            width: 80,
            height: 30,
            offsetCenter: [25, '20%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
            },
          },
          data: [{ value: 0, name: '(TX) Mb/s' }],
        },
        {
          name: '速度',
          type: 'gauge',
          center: ['75%', '55%'],    // 默认全局居中
          radius: '30%',
          min: 0,
          max: 8,
          startAngle: 135,
          endAngle: -45,
          splitNumber: 4,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.2, 'lime'], [0.8, '#1e90ff'], [1, '#ff4500']],
              width: 2,
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          axisTick: {            // 坐标轴小标记
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          axisLabel: {
            textStyle: {       // 属性lineStyle控制线条样式
              fontWeight: 'bolder',
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          splitLine: {           // 分隔线
            length: 15,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 3,
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          pointer: {
            width: 2,
            shadowColor: '#fff', // 默认透明
            shadowBlur: 5,
          },
          title: {
            show: true,
            offsetCenter: [0, '-30%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontStyle: 'italic',
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          detail: {
            show: true,
          },
          data: [{ value: 0, name: '(RX) Mb/s' }],
        },
      ],
    };
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
          type="checkbox"
          label={_('Advanced Options')}
          value={showAdvance === '1'}
          onClick={this.props.toggleShowAdvanceBtn}
        />
        {
          (showAdvance === '1') ? (
            <div>
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
              <FormGroup
                type="number"
                label={_('Test Duration')}
                value={time}
                onChange={(data) => {
                  this.props.updateItemSettings({
                    time: data.value,
                  });
                }}
                required
                {...validTime}
              />
            </div>
          ) : null
        }
        <FormGroup>
          <Button
            theme="primary"
            text={_('Run Test')}
            loading={this.props.selfState.get('time') !== ''}
            disabled={this.props.selfState.get('time').length !== 0}
            onClick={() => this.props.clickSpeedTestRunBtn()}
          />
          {
            this.props.selfState.get('time') === '' ? null : (
              <span>{_('Time Remain: ') + this.props.selfState.get('time') + 's'}</span>
            )
          }
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
        <ReactEchart
          option={chartOption}
          needClear={false}
          style={{
            width: '900px',
            height: '600px',
          }}
        />
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
