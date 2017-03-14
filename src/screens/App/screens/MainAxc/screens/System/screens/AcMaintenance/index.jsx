import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import AppScreen from 'shared/components/Template/AppScreen';
import FormGroup from 'shared/components/Form/FormGroup';
import SaveButton from 'shared/components/Button/SaveButton';
import FileUpload from 'shared/components/FileUpload';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import { getActionable } from 'shared/axc';
import AcVersion from './AcVersion';


const languageOptions = List(b28n.getOptions().supportLang).map((item) => (
  {
    value: item,
    label: b28n.langMap[item] || 'English',
  }
)).toJS();
const AXC1000_REBOOT_TIME = 4200;
const AXC3000_REBOOT_TIME = 3000;

function onChangeLang(data) {
  if (b28n.getLang() !== data.value) {
    b28n.setLang(data.value);
    window.location.reload();
  }
}

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,
  fetch: PropTypes.func,
  createModal: PropTypes.func,
  closeModal: PropTypes.func,
  changeModalState: PropTypes.func,
  changeLoginStatus: PropTypes.func,
  changeLoginState: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onReboot',
      'onBackup',
      'onSaveConfiguration',
      'onRestore',
      'onConfirm',
      'checkSaveResult',
      'renderUpgrade',
      'initState',
    ]);

    this.state = {
      isRebooting: false,
      isRestoring: false,
      isSaveConfig: false,
      rebootStepTime: AXC3000_REBOOT_TIME,
    };
    this.actionable = getActionable(props);
  }

  componentWillMount() {
    this.initState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.app.get('version') !== this.props.app.get('version')) {
      this.initState(nextProps);
    }
  }

  onReboot() {
    if (this.actionable) {
      return this.props.save('goform/system/reboot');
    }
  }

  onBackup() {
    if (this.actionable) {
      window.location.href = '/goform/system/backup';
    }
  }

  onSaveConfiguration() {
    if (this.actionable) {
      this.setState({
        isSaveConfig: true,
      });
      return this.props.save('goform/system/saveConfig')
        .then(() => this.setState({
          isSaveConfig: false,
        }));
    }
  }

  onRestore() {
    if (this.actionable) {
      return this.props.save('goform/system/restore');
    }
  }

  onConfirm(type) {
    const handleMap = {
      reboot: {
        text: _('Are you sure to reboot?'),
        loadingTitle: _('Rebootting..., Do not shutdown device.'),
        onSave: this.onReboot,
      },
      restoreToFactory: {
        text: _('Are you sure to restore to factory?'),
        loadingTitle: _('Restoring..., Do not shutdown device'),
        onSave: this.onRestore,
      },
      restoreConfig: {
        text: _('Are you sure to restore Configuration?'),
        loadingTitle: _('Restoring..., Do not shutdown device'),
        onSave: () => {},
      },
    };
    const curHandle = handleMap[type];

    if (curHandle) {
      this.props.createModal({
        role: 'confirm',
        text: curHandle.text,
        apply: () => {
          this.props.createModal({
            role: 'loading',
            title: '',
            loadingStep: this.state.rebootStepTime,
            loadingTitle: curHandle.loadingTitle,
            onLoaded: () => {
              this.props.closeModal();
              this.props.changeLoginStatus('0');
              this.props.changeLoginState({
                needReload: true,
              });
              window.location.hash = '#';
            },
          });

          curHandle.onSave();
          this.checkSaveResult(true);
        },
      });
    }
  }
  initState(props) {
    if (props.app.get('version').indexOf('AXC1000')) {
      this.setState({
        rebootStepTime: AXC1000_REBOOT_TIME,
      });
    }
  }
  checkSaveResult(isFirst) {
    let timeoutTime = 5000;

    if (!isFirst) {
      this.props.fetch('goform/axcInfo')
        .then((json) => {
          if (json && json.state && json.state.code === 2000) {
            this.props.changeModalState({
              loadingStep: 20,
            });
            clearTimeout(this.checkUpgradOkTimeout);
          }
        });
    } else {
      timeoutTime = 20000;
    }

    this.checkUpgradOkTimeout = setTimeout(() => {
      this.checkSaveResult();
    }, timeoutTime);
  }

  render() {
    const restoreUrl = '/goform/system/restore';
    const { store, route } = this.props;
    const configUpdateAt = store.getIn([
      route.id,
      'data',
      'info',
      'configUpdateAt',
    ]);

    return (
      <AppScreen
        {...this.props}
        noTitle
      >
        <div
          className="o-form"
          style={{
            paddingBottom: '60px',
          }}
        >
          <AcVersion
            {...this.props}
            loadingStep={this.state.rebootStepTime}
            onReboot={this.onReboot}
            actionable={this.actionable}
          />
          <fieldset className="o-form__fieldset">
            <FormGroup label={_('Reboot Controller')}>
              <SaveButton
                type="button"
                icon="refresh"
                text={_('Reboot Now')}
                disabled={!this.actionable}
                onClick={
                  () => this.onConfirm('reboot')
                }
              />
            </FormGroup>
          </fieldset>
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Configuration')}</legend>
            <FormGroup label={_('Save Configuration')}>
              <SaveButton
                type="button"
                icon="save"
                loading={this.state.isSaveConfig}
                text={_('Save Configuration')}
                disabled={!this.actionable}
                onClick={
                  () => this.onSaveConfiguration()
                }
              />
            </FormGroup>
            <FormGroup label={_('Backup Configuration')}>
              <SaveButton
                type="button"
                icon="download"
                text={_('')}
                onClick={this.onBackup}
                disabled={!this.actionable}
              />
              <span className="help">
                {
                  configUpdateAt ? `${_('Latest Configuration:')} ${moment(configUpdateAt).format('YYYY-MM-DD HH:mm')}` : ''
                }
              </span>
            </FormGroup>
            <FormGroup label={_('Restore To Factory')}>
              <SaveButton
                type="button"
                icon="undo"
                text=""
                disabled={!this.actionable}
                onClick={
                  () => this.onConfirm('restoreToFactory')
                }
              />
            </FormGroup>
            <FormGroup
              label={_('Restore Configuration')}
            >
              <FileUpload
                url={restoreUrl}
                name="backupFile"
                buttonIcon="undo"
                buttonText={_('Restore Now')}
                disabled={!this.actionable}
                acceptExt="db"
                createModal={this.props.createModal}
                onBeforeUpload={
                  () => {
                    this.props.createModal({
                      role: 'loading',
                      title: '',
                      loadingStep: this.state.rebootStepTime,
                      loadingTitle: _('Restoring..., Do not shutdown device'),
                      onLoaded: () => {
                        this.props.closeModal();
                        this.props.changeLoginStatus('0');
                        this.props.changeLoginState({
                          needReload: true,
                        });
                        window.location.hash = '#';
                      },
                    });
                    this.checkSaveResult(true);
                  }
                }
              />
            </FormGroup>

          </fieldset>

          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Language')}</legend>
            <FormGroup
              type="select"
              options={languageOptions}
              value={b28n.getLang()}
              onChange={onChangeLang}
            />
          </fieldset>
        </div>
      </AppScreen>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

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

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
