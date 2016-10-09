import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import {
  Button, FormGroup, FormInput, Modal, Table, SaveButton,
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
    const props = this.props;
    clearInterval(a);
    props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      defaultData: {
        ip: '192.168.1.10',
        time: '30',
        direction: '0',
      },
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
                onChange={(data) => this.props.updateItemSettings({
                  time: data.value,
                })}
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
            onClick={this.onRunTest}
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
