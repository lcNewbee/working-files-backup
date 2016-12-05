import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormGroup, SaveButton,
} from 'shared/components';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screensActions from 'shared/actions/screens';

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
                label={_('Device License')}
              />
              <div className="m-description-list">
                <dl className="m-description-list-row">
                  <dt style={dtStyle}>{_('License Status')}</dt>
                  <dd>{$$curData.get('secure_type')}</dd>
                </dl>
                {
                  /*  <dl className="m-description-list-row">
                    <dt style={dtStyle}>{_('AP Number')}</dt>
                    <dd>1000</dd>
                  </dl>
                  <dl className="m-description-list-row">
                    <dt style={dtStyle}>{_('Expiration Date')}</dt>
                    <dd>2018-02-23</dd>
                  </dl> */
                }
              </div>
            </div>
            <div className="cols col-6">
              {/* <FormGroup
                type="textarea"
                label={_('Firmware Upgrade License')}
              />
              <div className="m-description-list">
                <dl className="m-description-list-row">
                  <dt style={dtStyle}>{_('License Status')}</dt>
                  <dd>{_('Unlicensed')}</dd>
                </dl>
                <dl className="m-description-list-row">
                  <dt style={dtStyle}>{_('Expiration Date')}</dt>
                  <dd>2018-02-23</dd>
                </dl>
              </div> */}
            </div>
          </div>
          <div className="form-group form-group--save">
            <div className="form-control">
              <SaveButton
                type="button"
                loading={app.get('saving')}
                onClick={this.onSave}
              />
            </div>
          </div>
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
