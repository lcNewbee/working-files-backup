import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import utilsCore from 'shared/utils/lib/core';
import { FormGroup, Icon } from 'shared/components';
import validator from 'shared/validator';

import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

import WizardContainer from 'shared/components/Organism/WizardContainer';
import './quicksetup.scss';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,
  fetchScreenData: PropTypes.func,
  validateOption: PropTypes.object,
  validateAll: PropTypes.func,
  createModal: PropTypes.func,
  receiveScreenData: PropTypes.func,
};

const defaultProps = {

};

const validOptions = ((n) => {
  let options = Map({
    validWanIp: validator({
      rules: 'ip',
    }),
    validWanMask: validator({
      rules: 'mask',
    }),
    validGateway: validator({
      rules: 'ip',
    }),
  });
  while (n-- >= 0) {
    options = options.set(`validLanIp${n}`, validator({
      rules: 'ip',
    })).set(`validLanMask${n}`, validator({
      rules: 'mask',
    }));
  }
  return options;
})(10);

export default class AxcQuickSetup extends React.Component {
  constructor(props) {
    super(props);
    this.options = fromJS([]);
    utilsCore.binds(this, [
      'setWanSettingOption', 'setLanSettingOption', 'setConfirmOption',
      'renderWanSettingPage', 'renderLanSettingPage', 'renderConfirmPage',
      'onBeforeStep', 'wanSettingsCombineValidate', 'onCompleted',
    ]);
    this.state = {
      interfaceList: fromJS([]),
    };
  }

  componentWillMount() {
    this.props.fetchScreenData({ url: this.props.route.fetchUrl })
        .then(() => {
          const curScreenId = this.props.store.get('curScreenId');
          const restoreState = this.props.store.getIn([curScreenId, 'data', 'restoreState']);
          if (restoreState === '0') {
            window.location.hash = this.props.route.mainPath;
          }
        });
  }

  componentWillReceiveProps(nextProps) {
    const curScreenId = nextProps.store.get('curScreenId');
    let nextInterfaceList = nextProps.store.getIn([curScreenId, 'data', 'interfaceList']);
    const curInterfaceList = this.props.store.getIn([curScreenId, 'data', 'interfaceList']);
    // 只有当data变化时才更新state，否则数据验证无法进行
    // （修改的数据保存在state中，如果只要props更新就更新state，state总是会被置为data的值）
    if (nextInterfaceList && !(nextInterfaceList.equals(curInterfaceList))) {
      // 如果没有WAN口，则设置第一个为默认的WAN口,其余的都设为lan
      const hasWan = nextInterfaceList.findIndex(item => item.get('type') === 'wan');
      if (hasWan === -1) {
        nextInterfaceList = nextInterfaceList.map(item => item.set('type', 'lan'))
                            .setIn([0, 'type'], 'wan').setIn([0, 'enable'], '1');
      }
      this.setState({ interfaceList: nextInterfaceList });
    }
  }

  componentWillUnmount() {
    const curScreenId = this.props.store.get('curScreenId');
    this.props.receiveScreenData(fromJS({ interfaceList: [] }), curScreenId);
    console.log(this.props.store.getIn([curScreenId, 'data']).toJS());
  }

  onBeforeStep(stepObj) {
    if (stepObj.currStep < stepObj.targetStep) {
      return this.props.validateAll().then((msg) => {
        console.log('saasa', stepObj);
        if (!msg.isEmpty()) return ' ';
        else if (msg.isEmpty()) {
          if (stepObj.currStep === 0 && stepObj.targetStep === 1) {
            const wanErrorMsg = this.wanSettingsCombineValidate();
            console.log('wanErrorMsg', wanErrorMsg);
            if (wanErrorMsg) return wanErrorMsg;
          }

          if (stepObj.currStep === 1 && stepObj.targetStep === 2) {
            const lanErrorMsg = this.lanSettingsCombineValidate();
            if (lanErrorMsg) {
              this.props.createModal({
                role: 'alert',
                text: lanErrorMsg,
              });
              return ' ';
            }
          }
        }
      });
    }
    return '';
  }

  onCompleted(stepObj) {
    console.log('stepobj oncomplete', stepObj);
    if (stepObj.currStep === stepObj.targetStep) {
      this.props.save(this.props.route.fetchUrl, this.state.interfaceList.toJS())
          .then((json) => {
            if (json.state && json.state.code === 2000) {
              window.location.hash = this.props.route.mainPath;
            }
          });
    }
  }

  setWanSettingOption() {
    return fromJS({
      title: __('WAN Settings'),
      currStep: 0,
      render: this.renderWanSettingPage,
    });
  }

  setLanSettingOption() {
    return fromJS({
      title: __('LAN Settings'),
      currStep: 1,
      render: this.renderLanSettingPage,
    });
  }

  setConfirmOption() {
    return fromJS({
      title: __('Confirm'),
      currStep: 2,
      render: this.renderConfirmPage,
    });
  }


  wanSettingsCombineValidate() {
    const list = this.state.interfaceList;
    const wanPos = list.findIndex(item => item.get('type') === 'wan');
    const ip = list.getIn([wanPos, 'ip']);
    const mask = list.getIn([wanPos, 'mask']);
    const gateway = list.getIn([wanPos, 'gateway']);
    const msg = validator.combine.needStaticIP(ip, mask, gateway);
    return msg;
  }

  lanSettingsCombineValidate() {
    const list = this.state.interfaceList;
    const wanSetting = list.find(item => item.get('type') === 'wan');
    const wanIp = wanSetting.get('ip');
    const wanMask = wanSetting.get('mask');
    const wanName = wanSetting.get('name');

    const lanSettings = list.filter(item => item.get('type') === 'lan' && item.get('enable') === '1');
    const lanSize = lanSettings.size;
    let msg = '';
    // 不能和WAN口有相同的网段
    for (let i = 0; i < lanSize; i++) {
      const lanIp = lanSettings.getIn([i, 'ip']);
      const lanMask = lanSettings.getIn([i, 'mask']);
      const lanName = lanSettings.getIn([i, 'name']);
      const msgOption = { ipLabel: lanName, ip2Label: `${wanName}(WAN)` };
      msg = validator.combine.needSeparateSegment(lanIp, lanMask, wanIp, wanMask, msgOption);
      if (msg) break;
    }
    if (msg) return msg;

    // lan口之间不能有相同的网段
    for (let i = 0; i < lanSize; i++) {
      const lanIp1 = lanSettings.getIn([i, 'ip']);
      const lanMask1 = lanSettings.getIn([i, 'mask']);
      const lanName1 = lanSettings.getIn([i, 'name']);
      for (let j = i + 1; j < lanSize; j++) {
        const lanIp2 = lanSettings.getIn([j, 'ip']);
        const lanMask2 = lanSettings.getIn([j, 'mask']);
        const lanName2 = lanSettings.getIn([j, 'name']);
        const msgOption = { ipLabel: lanName1, ip2Label: lanName2 };
        msg = validator.combine.needSeparateSegment(lanIp1, lanMask1, lanIp2, lanMask2, msgOption);
        if (msg) break;
      }
      if (msg) break;
    }
    if (msg) return msg;

    return '';
  }

  renderWanSettingPage() {
    const list = this.state.interfaceList;
    if (typeof list === 'undefined') return null;
    const wanOptions = list && list.map(item => ({ label: item.get('name'), value: item.get('name') })).toJS();
    const wanPos = list && list.findIndex(it => it.get('type') === 'wan');
    const { validWanIp, validWanMask, validGateway } = this.props.validateOption;
    return (
      <div className="row">
        <div className="cols col-4 col-offset-4">
          <FormGroup
            type="select"
            label={__('WAN Select')}
            options={wanOptions}
            value={wanPos !== -1 && list.getIn([wanPos, 'name'])}
            onChange={(data) => {
              const pos = this.state.interfaceList.findIndex(it => it.get('name') === data.value);
              const newList = this.state.interfaceList.map(it => it.set('type', 'lan')).setIn([pos, 'type'], 'wan').setIn([pos, 'enable'], '1');
              this.setState(() => ({ interfaceList: newList }));
            }}
            required
          />
          <FormGroup
            type="text"
            label={__('IP')}
            value={list.getIn([wanPos, 'ip'])}
            onChange={(data) => {
              const pos = this.state.interfaceList.findIndex(it => it.get('type') === 'wan');
              const newList = this.state.interfaceList.setIn([pos, 'ip'], data.value);
              this.setState(() => ({ interfaceList: newList }));
            }}
            required
            {...validWanIp}
          />
          <FormGroup
            type="text"
            label={__('Mask')}
            value={list.getIn([wanPos, 'mask'])}
            onChange={(data) => {
              const pos = this.state.interfaceList.findIndex(it => it.get('type') === 'wan');
              const newList = this.state.interfaceList.setIn([pos, 'mask'], data.value);
              this.setState(() => ({ interfaceList: newList }));
            }}
            required
            {...validWanMask}
          />
          <FormGroup
            type="text"
            label={__('Gateway')}
            value={list.getIn([wanPos, 'gateway'])}
            onChange={(data) => {
              const pos = this.state.interfaceList.findIndex(it => it.get('type') === 'wan');
              const newList = this.state.interfaceList.setIn([pos, 'gateway'], data.value);
              this.setState(() => ({ interfaceList: newList }));
            }}
            required
            {...validGateway}
          />
        </div>
      </div>
    );
  }

  renderLanSettingPage() {
    // 找出不是WAN口，且enable状态为1的接口，渲染成一张卡片
    const list = this.state.interfaceList;
    // const cardList = list.filter(item => (item.get('type') !== 'wan' && item.get('enable') === '1'));
    const cardList = list.filter(item => (item.get('type') !== 'wan'));
    console.log('cardlist', cardList.toJS(), list.toJS());
    return (
      <div className="lan-card-row row">
        <div className="cols col-10 col-offset-1">
          {
            cardList.map((item, index) => {
              // 选择框中的项目为，既不是WAN口，也不在卡片当中的接口
              const selectList = list.filter(it => (it.get('type') !== 'wan' && it.get('enable') !== '1') || it.get('name') === item.get('name'));
              const selectOptions = selectList.map(it => ({ label: it.get('name'), value: it.get('name') }));
              const pos = list.findIndex(it => item.get('name') === it.get('name')); // 找出当前项在interfaceList中的位置
              const clsName = `quicksetup-setting-card ${item.get('enable') === '1' ? 'active-card' : ''}`;
              return (
                <div
                  className={clsName}
                  key={item.get('name')}
                >
                  <div
                    className="quicksetup-lan-card-close"
                    onClick={() => {
                      // if (cardList.size > 1) {
                      const newList = list.setIn([pos, 'enable'], '0');
                      this.setState(() => ({ interfaceList: newList }));
                      // }
                    }}
                  >
                    <Icon
                      name="times"
                      // disabled={cardList.size === 1}
                      style={{ fontSize: '14px' }}
                    />
                  </div>
                  <FormGroup
                    className="quicksetup-lan-setting-form"
                    type="select"
                    label={__('Select Lan')}
                    value={item.get('name')}
                    options={selectOptions && selectOptions.toJS()}
                    onChange={(data) => {
                      const newPos = list.findIndex(it => it.get('name') === data.value);
                      const newList = list.setIn([pos, 'enable'], '0').setIn([newPos, 'enable'], '1');
                      this.setState(() => ({ interfaceList: newList }));
                    }}
                    required
                  />
                  <FormGroup
                    className="quicksetup-lan-setting-form"
                    type="text"
                    label={__('IP')}
                    value={item.get('ip')}
                    onChange={(data) => {
                      const newList = list.setIn([pos, 'ip'], data.value);
                      this.setState(() => ({ interfaceList: newList }));
                    }}
                    required
                    {...this.props.validateOption[`validLanIp${index}`]}
                  />
                  <FormGroup
                    className="quicksetup-lan-setting-form"
                    type="text"
                    label={__('Mask')}
                    value={item.get('mask')}
                    onChange={(data) => {
                      const newList = list.setIn([pos, 'mask'], data.value);
                      this.setState(() => ({ interfaceList: newList }));
                    }}
                    required
                    {...this.props.validateOption[`validLanMask${index}`]}
                  />
                  <FormGroup
                    className="quicksetup-lan-setting-form"
                    type="checkbox"
                    label={__('DHCP Enable')}
                    checked={item.get('dhcpEnable') === '1'}
                    onChange={(data) => {
                      const newList = list.setIn([pos, 'dhcpEnable'], data.value);
                      this.setState(() => ({ interfaceList: newList }));
                    }}
                  />
                </div>
              );
            })
          }
          {
            list.filter(item => item.get('type') !== 'wan' && item.get('enable') !== '1').size > 0 && (
              <div className="quicksetup-card-adding">
                <Icon
                  name="plus"
                  style={{ fontSize: '40px', cursor: 'pointer' }}
                  onClick={() => {
                    const pos = list.findIndex(item => item.get('type') !== 'wan' && item.get('enable') !== '1');
                    const newList = list.setIn([pos, 'enable'], '1');

                    this.setState(() => ({ interfaceList: newList }));
                  }}
                />
              </div>
            )
          }
        </div>
      </div>
    );
  }

  renderConfirmPage() {
    const list = this.state.interfaceList;
    const enabledList = list && list.filter(item => item.get('enable') === '1');
    return (
      <div className="row">
        <div className="cols col-10 col-offset-1 quicksetup-confirm-card-container">
          {
            enabledList.map(item => (
              <div
                key={item.get('name')}
                className="quicksetup-confirm-card"
              >
                <dl className="clearfix">
                  <dt>{__('Name')}</dt>
                  <dd>{item.get('name')}</dd>
                </dl>

                <dl className="clearfix">
                  <dt>{__('Type')}</dt>
                  <dd>{item.get('type')}</dd>
                </dl>

                <dl className="clearfix">
                  <dt>{__('IP')}</dt>
                  <dd>{item.get('ip')}</dd>
                </dl>

                <dl className="clearfix">
                  <dt>{__('Mask')}</dt>
                  <dd>{item.get('mask')}</dd>
                </dl>
                {
                  item.get('type') === 'wan' && (
                    <dl className="clearfix">
                      <dt>{__('Next Hoop')}</dt>
                      <dd>{item.get('gateway')}</dd>
                    </dl>
                  )
                }
                {
                  item.get('type') === 'lan' && (
                    <dl className="clearfix">
                      <dt>{__('DHCP Enable')}</dt>
                      <dd>{item.get('dhcpEnable') === '1' ? 'Enabled' : 'Disabled'}</dd>
                    </dl>
                  )
                }
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  render() {
    this.WizardContainerOptions = fromJS([
      this.setWanSettingOption(),
      this.setLanSettingOption(),
      this.setConfirmOption(),
    ]);

    return (
      <WizardContainer
        options={this.WizardContainerOptions}
        onBeforeStep={this.onBeforeStep}
        onCompleted={this.onCompleted}
      />
    );
  }
}

AxcQuickSetup.propTypes = propTypes;
AxcQuickSetup.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(AxcQuickSetup);
