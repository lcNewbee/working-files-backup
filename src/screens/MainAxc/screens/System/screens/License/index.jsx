import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import SaveButton from 'shared/components/Button/SaveButton';
import FormGroup from 'shared/components/Form/FormGroup';
import { getActionable } from 'shared/axc';
import { actions as appActions } from 'shared/containers/app';
import { actions as screensActions, AppScreen } from 'shared/containers/appScreen';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  saveScreenSettings: PropTypes.func,
  updateScreenSettings: PropTypes.func,
};

const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.actionable = getActionable(props);
  }
  onSave() {
    this.props.saveScreenSettings();
  }

  render() {
    const dtStyle = {
      width: '20%',
    };
    const { app, store, updateScreenSettings } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$curData = store.getIn([myScreenId, 'curSettings']);

    return (
      <AppScreen
        {...this.props}
      >
        <form className="o-form o-form--block">
          <div className="row">
            <div className="cols col-6">
              <FormGroup
                type="textarea"
                value={$$curData.get('secure_license')}
                onChange={
                  (data) => {
                    updateScreenSettings({
                      secure_license: data.value,
                    });
                  }
                }
                label={__('Device License')}
              />
              <div className="o-description-list">
                <dl className="o-description-list-row">
                  <dt style={dtStyle}>{__('License Status')}</dt>
                  <dd>{__($$curData.get('secure_status'))}</dd>
                </dl>
                {
                  /*  <dl className="o-description-list-row">
                    <dt style={dtStyle}>{__('AP Number')}</dt>
                    <dd>1000</dd>
                  </dl>
                  <dl className="o-description-list-row">
                    <dt style={dtStyle}>{__('Expiration Date')}</dt>
                    <dd>2018-02-23</dd>
                  </dl> */
                }
              </div>
            </div>
            <div className="cols col-6">
              {/* <FormGroup
                type="textarea"
                label={__('Firmware Upgrade License')}
              />
              <div className="o-description-list">
                <dl className="o-description-list-row">
                  <dt style={dtStyle}>{__('License Status')}</dt>
                  <dd>{__('Unlicensed')}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt style={dtStyle}>{__('Expiration Date')}</dt>
                  <dd>2018-02-23</dd>
                </dl>
              </div> */}
            </div>
          </div>
          {
            this.actionable ? (
              <div className="form-group form-group--save">
                <div className="form-control">
                  <SaveButton
                    type="button"
                    loading={app.get('saving')}
                    onClick={this.onSave}
                    text={__('Apply')}
                    savingText={__('Applying')}
                    savedText={__('Applied')}
                  />
                </div>
              </div>
            ) : null
          }
        </form>
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
    screensActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
