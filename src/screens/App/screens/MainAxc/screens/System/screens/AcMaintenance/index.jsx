import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
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
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    utils.binds(this, [
      'onReboot',
      'onBackup',
      'onRestore',
      'onConfirm',
      'checkSaveResult',
      'renderUpgrade',
    ]);

    this.state = {
      isRebooting: false,
      isRestoring: false,
    };
    this.actionable = getActionable(props);
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
        text: _('Are you sure to reboot?'),
        loadingTitle: _('Rebootting..., Do not shutdown device.'),
        onSave: this.onReboot,
      },
      restore: {
        text: _('Are you sure to restore to factory?'),
        loadingTitle: _('Restoring..., Do not shutdown device'),
        onSave: this.onRestore,
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
            loadingStep: 3200,
            loadingTitle: curHandle.loadingTitle,
            onLoaded: () => {
              this.props.closeModal();
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
      timeoutTime = 15000;
    }

    this.checkUpgradOkTimeout = setTimeout(() => {
      this.checkSaveResult();
    }, timeoutTime);
  }

  render() {
    const restoreUrl = '/goform/system/restore';

    return (
      <AppScreen
        {...this.props}
        noTitle
      >
        <div className="o-form">
          <AcVersion
            {...this.props}
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
            <FormGroup label={_('Backup Configuration')}>
              <SaveButton
                type="button"
                icon="download"
                text={_('')}
                onClick={this.onBackup}
                disabled={!this.actionable}
              />
            </FormGroup>
            <FormGroup label={_('Restore To Factory')}>
              <SaveButton
                type="button"
                icon="undo"
                text=""
                disabled={!this.actionable}
                onClick={
                  () => this.onConfirm('restore')
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
    groupId: state.product.getIn(['group', 'selected', 'id']),
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
