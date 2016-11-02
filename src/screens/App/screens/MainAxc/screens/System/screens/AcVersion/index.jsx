import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import utils from 'shared/utils';
import FormContainer from 'shared/components/Organism/FormContainer';
import WizardContainer from 'shared/components/Organism/WizardContainer';
import DropzoneComponent from 'react-dropzone-component';
import PureComponent from 'shared/components/Base/PureComponent';
import FormGroup from 'shared/components/Form/FormGroup';
import FileUpload from 'shared/components/FileUpload';
import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';
import 'dropzone/dist/min/dropzone.min.css';

import './_style.scss';


const _ = window._;
const msg = {
  password: _('Password'),
  versionUses: _('Version Uses To'),
  selectFile: _('Select Version File'),
  confirmpasswd: _('Confirm Password'),
  welcomeDes: _('Thank you for purchasing Axilspot enterprise-class products,' +
    ' you will complete the configuration for management system in minutes'),
  passwordDes: _('Please provide an administrator password to login to Axilspot management system'),
  completeDes: _('Please confirm your configuration below.' +
    ' Click back to modify the configuration or click finish to activate the configuration.' +
    ' After finish you will skip to management interface.'),
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

const stepOneFormGroupList = fromJS([
  {
    id: 'versionUses',
    type: 'switch',
    required: true,
    label: msg.versionUses,
    options: versionUsesOptions,
    placeholder: msg.country,
    validator: validator({}),
  }, {
    id: 'filename',
    type: 'file',
    required: true,
    label: msg.selectFile,
    maxLength: 21,
    placeholder: msg.selectFile,
    validator: validator({}),
  },
]);


const propTypes = {
  app: PropTypes.instanceOf(Map),
  save: PropTypes.func,
  createModal: PropTypes.func,
  fetchProductInfo: PropTypes.func,
  closeModal: PropTypes.func,
};
const defaultProps = {};
export default class View extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this,
      [
        'updateState', 'renderStepOne', 'onBeforeStep', 'upgradeAc',
        'acUploading', 'checkUpgradOk', 'renderStepThree',
      ]
    );
    this.state = {
      versionUses: '0',
      filename: '',
      fileUploaded: false,
      initStep: 0,
    };
  }

  componentWillMount() {
    // this.props.fetchScreenData();
  }

  componentWillUnmount() {
    // this.props.leaveScreen();
  }

  onBeforeStep(data) {
    const { targetStep, currStep } = data;
    const ret = '';

    // next
    if (targetStep > currStep) {
      if (currStep === 0) {
        this.upgradeAc();
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

    this.props.createModal({
      role: 'loading',
      title: _('Upgrade AC Version'),
      text: _('Upgrading AC version, Please do not shut down device.'),
    });

    this.props.save(url, { filename })
      .then(() => {
        this.checkUpgradOk(true);
      });
  }

  updateState(data) {
    this.setState(data);
  }

  renderStepOne() {
    const componentConfig = {
      postUrl: 'goform/system/version/upload',
    };
    const eventHandlers = {
      // This one receives the dropzone object as the first parameter
      // and can be used to additional work with the dropzone.js
      // object
      init: null,
      // All of these receive the event as first parameter:
      drop: null,
      dragstart: null,
      dragend: null,
      dragenter: null,
      dragover: null,
      dragleave: null,
      // All of these receive the file as first parameter:
      addedfile: null,
      removedfile: null,
      thumbnail: null,
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
      dictDefaultMessage: _('Drop or click to select file'),
    };

    return (
      <div className="ac-version">
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
  renderStepTwo() {
    return null;
  }

  renderStepThree() {
    const { app } = this.props;
    return (
      <div className="step-1">
        <FormGroup
          type="plain-text"
          label={_('currVersion')}
          value={app.getIn(['version'])}
        />
      </div>
    );
  }

  render() {
    const { versionUses, initStep } = this.state;
    const stepTwoTitleArr = [
      _('Upgrading Version'),
      _('Backup Version'),
    ];
    const options = fromJS([
      {
        title: _('Upload AC Version'),
        render: this.renderStepOne,
      }, {
        title: stepTwoTitleArr[versionUses],
        render: this.renderStepTwo,
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
        size="sm"
        nextDisabled={!this.state.fileUploaded}
        initStep={initStep}
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;


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
)(View);
