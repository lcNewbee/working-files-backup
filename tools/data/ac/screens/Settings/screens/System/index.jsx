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

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,
  fetch: PropTypes.func,
  fetchScreenData: PropTypes.func,
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
    };
    this.actionable = getActionable(props);
  }


  onBackup() {
    if (this.actionable) {
      window.location.href = '/goform/setBackup';
    }
  }

  onRestore() {
    if (this.actionable) {
      this.props.save('/goform/getRestore');
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
