import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

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
  changeModalState: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onBackup',
      'checkSaveResult',
      'renderUpgrade',
    ]);

    this.actionable = getActionable(props);
  }

  onBackup() {
    if (this.actionable) {
      window.location.href = 'goform/portal/access/download';
    }
  }

  render() {
    const uploadUrl = 'goform/portal/access/upload';

    return (
      <AppScreen
        {...this.props}
        noTitle
      >
        <div className="o-form">
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{__('Current Authentication Page Download')}</legend>
            <FormGroup label={__('Authentication Page Download')} >
              <SaveButton
                type="button"
                icon="download"
                text={__('')}
                onClick={this.onBackup}
                disabled={!this.actionable}
              />
            </FormGroup>
            <FormGroup label={__('预览')} >
              <span>
                <a className="tablelink" href={`http://${window.location.hostname}:8080/auth.jsp`} target="_blank">{__('Auth')}</a>
                <a className="tablelink" href={`http://${window.location.hostname}:8080/ok.jsp`}  target="_blank">{__('Success')}</a>
                <a className="tablelink" href={`http://${window.location.hostname}:8080/out.jsp`} target="_blank">{__('Exit')}</a>
                <a
                  className="tablelink"
                  href={`http://${window.location.hostname}:8080/wx.jsp`}
                  target="_blank"
                >
                  {__('Wechat')}
                </a>
              </span>
            </FormGroup>
          </fieldset>

          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{__('Authentication Page Update')}</legend>
            <FormGroup
              label={__('Please choose authentication page package(ZIP file)')}
            >
              <FileUpload
                url={uploadUrl}
                name="authenticationPageFile"
                buttonIcon="undo"
                buttonText={__('Upload Now')}
                disabled={!this.actionable}
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
