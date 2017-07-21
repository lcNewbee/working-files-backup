import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import downloadjs from 'downloadjs';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import SaveButton from 'shared/components/Button/SaveButton';
import FormGroup from 'shared/components/Form/FormGroup';
import FileUpload from 'shared/components/FileUpload';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { getActionable } from 'shared/axc';


const propTypes = {
  store: PropTypes.instanceOf(Map),
  fetch: PropTypes.func,
  changeModalState: PropTypes.func,
  createModal: PropTypes.func,
  closeModal: PropTypes.func,
  changeLoginStatus: PropTypes.func,
  changeLoginState: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onBackup',
      'onSaveConfiguration',
      'onRestore',
      'onConfirm',
      'checkSaveResult',
    ]);

    this.state = {
      isRestoring: false,
      downloadUrl: '',
    };
    this.actionable = getActionable(props);
  }

  componentDidMount() {
    this.props.fetch('/goform/setBackup')
        .then((json) => {
          const backupUrl = json && json.data && json.data.url;

          if (backupUrl) {
            this.setState({
              downloadUrl: backupUrl,
            });
          }
        });
  }

  onBackup() {
    if (this.actionable) {
      downloadjs(this.state.downloadUrl);
    }
  }


  onRestore() {
    if (this.actionable) {
      this.props.fetch('/goform/getRestore');
    }
  }

  onConfirm(type) {
    const handleMap = {
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
            loadingTitle: curHandle.loadingTitle,
            onLoaded: () => {
              this.props.closeModal();
              this.props.changeLoginStatus('0');
              this.props.changeLoginState({
                needReload: true,
              });
              window.location.hash = '#/login';
            },
          });

          curHandle.onSave();
          this.checkSaveResult(true);
        },
      });
    }
  }
  checkSaveResult(isFirst) {
    let timeoutTime = 5000;

    if (!isFirst) {
      this.props.fetch('goform/getAcInfo')
        .then((json) => {
          if (json && json.state && json.state.code === 2000) {
            this.props.changeModalState({
              loadingStep: 20,
            });
            clearTimeout(this.checkUpgradOkTimeout);
          }
        });
    } else {
      timeoutTime = 12000;
    }

    this.checkUpgradOkTimeout = setTimeout(() => {
      this.checkSaveResult();
    }, timeoutTime);
  }
  render() {
    const restoreUrl = '/goform/getRestore';
    const { store } = this.props;
    const configUpdateAt = store.getIn([
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
              {
                this.state.downloadUrl ? (
                  <SaveButton
                    type="button"
                    icon="download"
                    text={__('')}
                    onClick={this.onBackup}
                    disabled={!this.actionable}
                  />
                ) : null
              }

              <span className="help">
                {
                  configUpdateAt ? `${__('Latest Configuration:')} ${moment.unix(configUpdateAt).format('YYYY-MM-DD HH:mm')}` : ''
                }
              </span>
            </FormGroup>
            <FormGroup
              label={__('Restore Configuration')}
            >
              <FileUpload
                url={restoreUrl}
                name="filename"
                buttonIcon="undo"
                buttonText={__('Restore Now')}
                disabled={!this.actionable}
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
                        window.location.hash = '#/login';
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
