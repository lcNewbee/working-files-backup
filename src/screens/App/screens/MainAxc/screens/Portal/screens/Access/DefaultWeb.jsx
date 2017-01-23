import React, { PropTypes } from 'react';
import utils from 'shared/utils';
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
            <legend className="o-form__legend">{_('Current Authentication Page Download')}</legend>
            <FormGroup label={_('Authentication Page Download')} >
              <SaveButton
                type="button"
                icon="download"
                text={_('')}
                onClick={this.onBackup}
                disabled={!this.actionable}
              />
            </FormGroup>
          </fieldset>

          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Authentication Page Update')}</legend>
            <FormGroup
              label={_('Please choose authentication page package(ZIP file)')}
            >
              <FileUpload
                url={uploadUrl}
                name="authenticationPageFile"
                buttonIcon="undo"
                buttonText={_('Upload Now')}
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
