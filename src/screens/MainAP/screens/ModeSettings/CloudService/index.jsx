import React from 'react'; import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import FormGroup from 'shared/components/Form/FormGroup';
import SaveButton from 'shared/components/Button/SaveButton';
import ProgressBar from 'shared/components/ProgressBar';
import validator from 'shared/validator';
import Modal from 'shared/components/Modal';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { actions as appActions } from 'shared/containers/app';
import { actions as sharedActions } from 'shared/containers/settings';

const propTypes = {
  fetch: PropTypes.func,
  save: PropTypes.func,
  updateItemSettings: PropTypes.func,
  initSettings: PropTypes.func,
  route: PropTypes.object,
  createModal: PropTypes.func,
  validateAll: PropTypes.func,
  validateOption: PropTypes.object,
  store: PropTypes.instanceOf(Map),
};

const validOptions = Map({
  validateIp: validator({
    rules: 'ip',
  }),
});

export default class ModeSettings extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.saveModalChange = this.saveModalChange.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      defaultData: {
        showProgressBar: false,
        enable: '1',
        discoveryType: 'dhcp',
        acIp: '',
      },
    });
    this.props.fetch('goform/get_firstLogin_info')
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.props.updateItemSettings({
              nextMode: json.data.enable,
              currMode: json.data.enable,
              currAcIp: json.data.acIp,
              acIp: json.data.acIp,
              enable: json.data.enable,
              orgId: json.data.orgId,
              currOrgId: json.data.orgId,
            });
          }
        });
  }

  onSave() {
    this.props.validateAll().then((msg) => {
      const that = this;
      function validIp(str) {
        const ipArr = str.split('.');
        const ipHead = ipArr[0];
        if (ipArr[0] === '127') {
          return __('IP address begin with 127 is a reserved loopback address, please input another value between 1 to 233');
        }
        if (ipArr[0] > 223) {
          return __('IP Address begin with %s is invalid, please input a value between 1 to 223.', ipHead);
        }
        return '';
      }

      function reportError(str) {
        that.props.createModal({
          role: 'alert',
          text: `${__(str)}`,
        });
      }
      if (msg.isEmpty()) {
        const {
          nextMode, currMode, currAcIp, acIp, orgId, currOrgId,
        } = this.props.store.get('curData').toJS();
        if (nextMode !== currMode || (acIp !== currAcIp && nextMode === '1') || (orgId !== currOrgId && nextMode === '1')) {
          const addrArr = acIp.split(':');
          // 如果出现多个冒号，返回错误
          if (addrArr.length > 2) {
            reportError('Invalid server address!');
            return null;
          }
          // 验证IP或者域名
          const dominOrIp = addrArr[0];
          const dominValid = /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/.test(dominOrIp);
          const ipValid = /^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(dominOrIp);
          if (nextMode === '1') { // 只有当开关打开，才验证地址是否正确
            if (!dominValid && !ipValid) {
              reportError('Invalid domain name or ip address!');
              return null;
            } else if (!dominValid && ipValid) {
              const validmsg = validIp(dominOrIp);
              if (validmsg !== '') {
                reportError(validmsg);
                return null;
              }
            }
            // 验证端口
            const port = addrArr[1];
            if (typeof (port) !== 'undefined' && (port < 0 || port > 65535 || parseInt(port, 10).toString() !== port)) {
              reportError('Invalid server address! Port must be an integer between 0 and 65535 !');
              return null;
            }
          }
          // 以上验证都通过，则没有错误，保存
          this.props.createModal({
            role: 'alert',
            text: __('Configuration changed, REBOOT to take effect ?'),
            apply: this.saveModalChange,
          });
        } else {
          this.props.createModal({
            role: 'alert',
            text: __('Nothing changed, no need to do anything!'),
          });
        }
      }
    });
  }

  saveModalChange() {
    const saveDate = {
      enable: this.props.store.getIn(['curData', 'nextMode']),
      acIp: this.props.store.getIn(['curData', 'acIp']),
    };
    this.props.save('goform/set_thin', saveDate).then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.updateItemSettings({ showProgressBar: true });
      } else {
        this.props.createModal({
          role: 'alert',
          text: __('Mode Changed Failed !'),
        });
      }
    });
  }

  render() {
    const { acIp, nextMode, orgId } = this.props.store.get('curData').toJS();
    return (
      <div className="o-form">
        <div className="o-form__legend">{__('Cloud Service Settings')}</div>
        <br />
        <FormGroup
          type="checkbox"
          label={__('Service Enable')}
          checked={nextMode === '1'}
          onChange={(data) => {
            this.props.updateItemSettings({ nextMode: data.value });
          }}
        />
        <FormGroup
          type="text"
          label={__('Cloud Address')}
          value={acIp}
          disabled={nextMode === '0'}
          placeholder={__('IP or Domain Name')}
          help={__('Example:192.168.0.1:80')}
          onChange={(data) => {
            const serveradd = data.value.replace(/：/g, ':');
            this.props.updateItemSettings({ acIp: serveradd });
          }}
          required
          // {...this.props.validateOption.validateIp}
        />
        <FormGroup
          type="text"
          label={__('Organize ID')}
          value={orgId}
          disabled={nextMode === '0'}
          onChange={(data) => {
            this.props.updateItemSettings({ orgId: data.value });
          }}
        />
        <FormGroup>
          <SaveButton
            onClick={() => this.onSave()}
          />
        </FormGroup>
        <Modal
          className="excUpgradeBar"
          isShow={this.props.store.getIn(['curData', 'showProgressBar'])}
          style={{
            top: '200px',
            borderRadius: '20px',
          }}
          noFooter
          draggable
        >
          <ProgressBar
            title={__('rebooting , please wait...')}
            time={60}
            callback={() => {
              this.props.updateItemSettings({ showProgressBar: false });
              window.location.href = '#';
            }}
            start
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          />
        </Modal>
      </div>
    );
  }
}

ModeSettings.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    store: state.settings,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions, sharedActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(ModeSettings);
