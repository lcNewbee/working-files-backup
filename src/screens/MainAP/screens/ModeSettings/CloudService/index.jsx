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
            });
          }
        });
  }

  onSave() {
    this.props.validateAll().then((msg) => {
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
      if (msg.isEmpty()) {
        const {
          nextMode, currMode, currAcIp, acIp,
        } = this.props.store.get('curData').toJS();
        if (nextMode !== currMode || (acIp !== currAcIp && nextMode === '1')) {
          // situation 1：mode改变,则验证
          // situation 2: mode没有改变，而地址改变，则只有在mode开启的时候才验证输入是否正确
          let validmsg = '';
          const dominValid = /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/.test(acIp);
          const ipValid = /^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(acIp);
          if (!ipValid && !dominValid && nextMode === '1') {
            validmsg = __('Please input a valid ntp server!');
          } else if (ipValid && nextMode === '1') {
            validmsg = validIp(acIp);
          } else if (!dominValid && nextMode === '1') {
            validmsg = __('Please input a valid ntp server!');
          }
          // validmsg不为空，则存在错误
          if (validmsg !== '') {
            this.props.createModal({
              role: 'alert',
              text: validmsg,
            });
            return null;
          }
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
    const { acIp, nextMode } = this.props.store.get('curData').toJS();
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
          label={__('Server Address')}
          value={acIp}
          disabled={nextMode === '0'}
          onChange={(data) => {
            this.props.updateItemSettings({ acIp: data.value });
          }}
          required
          // {...this.props.validateOption.validateIp}
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
