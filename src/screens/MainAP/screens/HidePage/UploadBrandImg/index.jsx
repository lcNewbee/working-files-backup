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
    this.onFarewellUpgrade = this.onFarewellUpgrade.bind(this);
  }

  onFarewellUpgrade(e) {
    const that = this;
    const input = document.getElementById('upgradeFile');
    const formElem = document.getElementById('upgradeForm');
    e.preventDefault();
    if (!input.value) {
      return;
    }
    function upgradeDevice() {
      Promise.resolve().then(() => {
        const upgradeBarInfo = that.props.selfState.get('upgradeBarInfo').set('isShow', true);
        that.props.changeUpgradeBarInfo(upgradeBarInfo);
      }).then(() => {
        const upgradeBarInfo = that.props.selfState.get('upgradeBarInfo').setIn(['firstBar', 'start'], true);
        that.props.changeUpgradeBarInfo(upgradeBarInfo);
      });
      utils.postForm(formElem.action, formElem).then((json) => {
        if (json.state && json.state.code === 4000) {
          that.props.resetSelfState();
          that.props.createModal({
            id: 'settings',
            role: 'alert',
            text: __('Invalid firmware!'),
          });
        }
      });
    }

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: __('Sure you want to UPGRADE the software and REBOOT ?'),
      apply: upgradeDevice,
    });
  }

  render() {
    return (
      <div className="o-form">
        <div className="o-form__legend">{__('Cloud Service Settings')}</div>
        <br />
        <form
          action="/cgi-bin/upload.cgi"
          method="POST"
          encType="multipart/form-data"
          id="upgradeForm"
          className="clearfix"
        >
          <FormGroup
            label={__('Firmware Upgrade')}
            type="file"
            name="filename"
            id="upgradeFile"
            className="fl"
            style={{
              marginRight: '5px',
            }}
          />
          <SaveButton
            type="button"
            icon=""
            text={__('Upgrade')}
            onClick={this.onFarewellUpgrade}
            theme="primary"
            className="fl"
          />
        </form>
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
