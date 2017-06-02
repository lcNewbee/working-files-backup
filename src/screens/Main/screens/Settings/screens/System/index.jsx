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


const AXC1000_REBOOT_TIME = 8600;
const AXC3000_REBOOT_TIME = 3600;



const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
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
    ]);

    this.state = {
      isRebooting: false,
      isRestoring: false,
      rebootStepTime: AXC3000_REBOOT_TIME,
    };
    this.actionable = getActionable(props);
  }

  componentWillMount() {
    this.initState(this.props);
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
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{__('Configuration')}</legend>
            <FormGroup label={__('Backup Configuration')}>
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
            <FormGroup label={__('Restore To Factory')}>
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
              label={__('Restore Configuration')}
            >
              <FileUpload
                url={restoreUrl}
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
