import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import WizardContainer from 'shared/components/Organism/WizardContainer';
import DropzoneComponent from 'react-dropzone-component';
import PureComponent from 'shared/components/Base/PureComponent';
import FormGroup from 'shared/components/Form/FormGroup';
import * as appActions from 'shared/actions/app';
import 'dropzone/dist/min/dropzone.min.css';

import './_style.scss';

const _ = window._;
const msg = {
  password: _('Password'),
  versionUses: _('Version Uses To'),
  selectFile: _('Select Version File'),
  dictDefaultMessage: _('Drop or click to select file'),
  removefile: _('Remove File'),
  currentVersion: _('Current Version'),
  upAcVersionTitle: _('Upgrade AC Version'),
  backupAcVersion: _('Backup AC Version'),
  sureUpgradeAc: _('Are you sure to UPGRADE the software and REBOOT ?'),
  upgradingACversion: _('Upgrading AC version, Please do not shut down device.'),
  backupingAcVersion: _('Backuping AC version'),
};
let checkUpgradOkTimeout = null;

const versionUsesOptions = [
  {
    value: '0',
    label: _('Upgrade'),
  }, {
    value: '1',
    label: _('Backup'),
  },
];

const propTypes = {
  app: PropTypes.instanceOf(Map),
  save: PropTypes.func,
  createModal: PropTypes.func,
  fetchProductInfo: PropTypes.func,
  closeModal: PropTypes.func,
};
const defaultProps = {};
export default class AcVersion extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this,
      [
        'updateState', 'renderStepOne', 'onBeforeStep', 'upgradeAc',
        'acUploading', 'checkUpgradOk', 'renderStepThree', 'onComplete',
      ]
    );
    this.state = {
      versionUses: '0',
      filename: '',
      fileUploaded: false,
      initStep: 0,
    };
  }

  onComplete() {
    console.log('onCompleted')
    this.setState({
      initStep: 0,
      fileUploaded: false,
    });
  }

  onBeforeStep(data) {
    const { targetStep, currStep } = data;
    let ret = '';

    // next
    if (targetStep > currStep) {
      if (currStep === 0) {
        ret = this.upgradeAc();
      }
    }

    return ret;
  }

  checkUpgradOk(isFirst) {
    if (!isFirst) {
      this.props.fetchProductInfo('goform/axcInfo')
        .then((json) => {
          if (json && json.state && json.state.code === 2000) {
            clearTimeout(checkUpgradOkTimeout);
            this.props.closeModal();
            this.setState({
              initStep: 2,
            });
          }
        });
    }
    checkUpgradOkTimeout = setTimeout(() => {
      this.checkUpgradOk();
    }, 5000);
  }

  upgradeAc() {
    const { filename } = this.state;
    const url = 'goform/system/version/upgrade';
    const promise = new Promise((resolve, reject) => {
      this.props.createModal({
        role: 'confirm',
        title: msg.upAcVersionTitle,
        text: msg.sureUpgradeAc,
        apply: () => {
          this.props.createModal({
            role: 'loading',
            title: msg.upAcVersionTitle,
            text: msg.upgradingACversion,
          });

          this.props.save(url, { filename })
            .then(() => {
              this.checkUpgradOk(true);
            });
          resolve();
        },
        cancel: () => reject(),
      });
    });

    return promise;
  }

  updateState(data) {
    this.setState(data);
  }

  renderStepOne() {
    const { app } = this.props;
    const componentConfig = {
      postUrl: 'goform/system/version/upload',
    };
    const eventHandlers = {
      removedfile: () => {
        this.updateState({
          fileUploaded: false,
          filename: '',
        });
      },
      error: (file) => {
        console.log(file);
      },
      processing: null,
      uploadprogress: null,
      sending: null,
      success: (file) => {
        this.updateState({
          fileUploaded: true,
          filename: file.name,
        });
      },
      complete() {

      },
      canceled: null,
      maxfilesreached: null,
      maxfilesexceeded: null,
      // All of these receive a list of files as first parameter
      // and are only called if the uploadMultiple option
      // in djsConfig is true:
      processingmultiple: null,
      sendingmultiple: null,
      successmultiple: null,
      completemultiple: null,
      canceledmultiple: null,
      // Special Events
      totaluploadprogress: null,
      reset: null,
      queuecomplete: null,
    };
    const djsConfig = {
      paramName: 'versionFile',
      maxFiles: 1,
      addRemoveLinks: 'dictCancelUploadConfirmation',
      dictDefaultMessage: msg.dictDefaultMessage,
      dictRemoveFile: msg.removefile,
    };

    return (
      <div className="ac-version">
        <FormGroup
          type="plain-text"
          label={msg.currentVersion}
          value={app.getIn(['version'])}
        />
        <FormGroup
          label={msg.versionUses}
          type="switch"
          name="versionUses"
          options={versionUsesOptions}
          value={this.state.versionUses}
          onChange={data => this.updateState({
            versionUses: data.value,
          })}
        />
        <FormGroup
          label={msg.selectFile}
        >
          <DropzoneComponent
            config={componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig}
          />
        </FormGroup>
      </div>
    );
  }
  renderStepThree() {
    const { app } = this.props;
    return (
      <div className="step-1">
        <FormGroup
          type="plain-text"
          label={msg.currentVersion}
          value={app.getIn(['version'])}
        />
      </div>
    );
  }

  render() {
    const { versionUses, initStep } = this.state;
    const stepTwoTitleArr = [
      msg.upAcVersionTitle,
      msg.backupAcVersion,
    ];
    const options = fromJS([
      {
        title: _('Upload AC Version'),
        render: this.renderStepOne,
      }, {
        title: stepTwoTitleArr[versionUses],
        render: () => {
          let ret = msg.upgradingACversion;

          if (versionUses === '1') {
            ret = msg.backupingAcVersion;
          }

          return ret;
        },
      }, {
        title: _('Completed'),
        render: this.renderStepThree,
      },
    ]);

    return (
      <WizardContainer
        title={_('AC Version Setup Wizard')}
        options={options}
        onBeforeStep={this.onBeforeStep}
        onCompleted={this.onComplete}
        size="sm"
        nextDisabled={!this.state.fileUploaded}
        initStep={initStep}
      />
    );
  }
}

AcVersion.propTypes = propTypes;
AcVersion.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AcVersion);
