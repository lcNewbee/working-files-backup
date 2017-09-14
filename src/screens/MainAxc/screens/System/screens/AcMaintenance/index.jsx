import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import FormGroup from 'shared/components/Form/FormGroup';
import SaveButton from 'shared/components/Button/SaveButton';
import FileUpload from 'shared/components/FileUpload';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { getActionable } from 'shared/axc';
import AcVersion from './AcVersion';


const languageOptions = List(b28n.getOptions().supportLang).map(item => (
  {
    value: item,
    label: b28n.langMap[item] || 'English',
  }
)).toJS();
const AXC1000_REBOOT_TIME = 8600;
const AXC3000_REBOOT_TIME = 3600;

function onChangeLang(data) {
  if (b28n.getLang() !== data.value) {
    b28n.setLang(data.value);
    window.location.reload();
  }
}

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.shape({
    id: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  save: PropTypes.func,
  fetch: PropTypes.func,
  fetchScreenData: PropTypes.func,
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
      'onBackupApCfg',
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

  onBackupApCfg() {
    if (this.actionable) {
      window.location.href = 'goform/system/apbackup';
    }
  }

  onSaveConfiguration() {
    if (this.actionable) {
      this.setState({
        isSaveConfig: true,
      });
      return this.props.save('goform/system/saveConfig')
        .then(() => {
          this.props.fetchScreenData();
          this.setState({
            isSaveConfig: false,
          });
        });
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
        text: __('Are you sure to reboot?'),
        loadingTitle: __('Rebootting..., Do not shutdown device.'),
        onSave: this.onReboot,
      },
      restoreToFactory: {
        text: __('Are you sure to restore to factory?'),
        loadingTitle: __('Restoring..., Do not shutdown device'),
        onSave: this.onRestore,
      },
      restoreConfig: {
        text: __('Are you sure to restore Configuration?'),
        loadingTitle: __('Restoring..., Do not shutdown device'),
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
              this.props.history.push('/login');
            },
          });

          curHandle.onSave();
          this.checkSaveResult(true);
        },
      });
    }
  }
  initState(props) {
    if (props.app.get('version').indexOf('AXC1000') !== -1) {
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
      timeoutTime = 35000;
    }

    this.checkUpgradOkTimeout = setTimeout(() => {
      this.checkSaveResult();
    }, timeoutTime);
  }

  render() {
    const acRestoreUrl = '/goform/system/restore';
    const apRestoreUrl = '/goform/system/aprestore';
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
          style={{ paddingBottom: '60px' }}
        >
          <AcVersion
            {...this.props}
            loadingStep={this.state.rebootStepTime}
            onReboot={this.onReboot}
            actionable={this.actionable}
          />
          <fieldset className="o-form__fieldset">
            <FormGroup label={__('Reboot Controller')}>
              <SaveButton
                type="button"
                icon="power-off"
                text={__('Reboot Now')}
                disabled={!this.actionable}
                onClick={() => this.onConfirm('reboot')}
              />
            </FormGroup>
          </fieldset>
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{__('Configuration')}</legend>
            <FormGroup label={__('Save Configuration')}>
              <SaveButton
                type="button"
                icon="save"
                loading={this.state.isSaveConfig}
                text={__('Save Configuration')}
                disabled={!this.actionable}
                onClick={() => this.onSaveConfiguration()}
              />
            </FormGroup>
            <FormGroup label={__('AC Configuration Backup')}>
              <SaveButton
                type="button"
                icon="download"
                text={__('')}
                onClick={this.onBackup}
                disabled={!this.actionable}
              />
              <span className="help">
                {
                  configUpdateAt ? `${__('Latest Configuration:')} ${moment.unix(configUpdateAt).format('YYYY-MM-DD HH:mm')}` : ''
                }
              </span>
            </FormGroup>
            <FormGroup label={__('AP Configuration Backup')}>
              <SaveButton
                type="button"
                icon="download"
                text={__('')}
                onClick={this.onBackupApCfg}
                disabled={!this.actionable}
              />
              <span className="help">
                {'Download the current AP configuration in readable form'}
              </span>
            </FormGroup>
            <FormGroup label={__('Restore To Factory')}>
              <SaveButton
                type="button"
                icon="undo"
                text=""
                disabled={!this.actionable}
                onClick={() => this.onConfirm('restoreToFactory')}
              />
            </FormGroup>
            <FormGroup
              label={__('Restore AC Configuration')}
            >
              <FileUpload
                url={acRestoreUrl}
                name="backupFile"
                buttonIcon="undo"
                buttonText={__('Restore Now')}
                disabled={!this.actionable}
                acceptExt={['db', 'zip']}
                createModal={this.props.createModal}
                onBeforeUpload={
                  () => {
                    this.props.createModal({
                      role: 'loading',
                      title: '',
                      loadingStep: this.state.rebootStepTime,
                      loadingTitle: __('Restoring..., Do not shutdown device'),
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

            <FormGroup
              label={__('Restore AP Configuration')}
            >
              <FileUpload
                url={apRestoreUrl}
                name="backupFile"
                buttonIcon="undo"
                buttonText={__('Restore Now')}
                disabled={!this.actionable}
                acceptExt={['xls', 'xlsx']}
                createModal={this.props.createModal}
                onBeforeUpload={
                  () => {
                    this.props.createModal({
                      role: 'loading',
                      title: '',
                      loadingStep: 100,
                      loadingTitle: __('Restoring..., Do not shutdown device'),
                      onLoaded: () => {
                        this.props.closeModal();
                      },
                    });
                    // this.checkSaveResult(true);
                  }
                }
              />
            </FormGroup>

          </fieldset>

          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{__('Language')}</legend>
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
