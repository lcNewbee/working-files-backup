import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { FormGroup, FormInput } from 'shared/components/Form';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  updateScreenSettings: PropTypes.func,
  saveScreenSettings: PropTypes.func,
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
  onChangeSettings(name, data) {
    this.props.updateScreenSettings({
      [name]: data.value,
    });
    clearTimeout(this.saveTimeOut);
    this.saveTimeOut = setTimeout(() => {
      this.onSave();
    }, 260);
  }
  render() {
    const { app } = this.props;
    const curScreenId = this.props.store.get('curScreenId');
    const curData = this.props.store.getIn([curScreenId, 'curSettings']).toJS();

    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }

    return (
      <AppScreen
        {...this.props}
        defaultSettingsData={{
          alarmNoteType: '0',
        }}
        noTitle
      >
        <form className="o-form">
          <FormGroup
            type="checkbox"
            id="enabled"
            label={_('Enable')}
            value="1"
            checked={curData.terminalProtection === '1'}
            onChange={
              item => this.onChangeSettings('terminalProtection', item)
            }
            style={{ marginRight: '6px' }}
            className="o-form__switch-bar"
          />
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Attack Detection')}</legend>
            <FormGroup
              value="1"
              type="checkbox"
              theme="square"
              text={_('Wireless Flood Attack')}
              checked={curData.floodAttact === '1'}
              onChange={
                item => this.onChangeSettings('floodAttact', item)
              }
            />
            <FormGroup
              value="1"
              type="checkbox"
              theme="square"
              text={_('Wireless Anti-spoofing Detection')}
              checked={curData.antiSpoofing === '1'}
              onChange={
                item => this.onChangeSettings('antiSpoofing', item)
              }
            />
            <FormGroup>
              <p>{_('After an attack is detected')}</p>
              <ul style={{ marginLeft: '24px' }}>
                <li className="row">
                  <FormInput
                    value="0"
                    type="radio"
                    name="alarmNoteType"
                    text={_('Alarm notification')}
                    checked={curData.alarmNoteType === '0'}
                    onChange={
                      item => this.onChangeSettings('alarmNoteType', item)
                    }
                  />
                </li>
                <li className="row">
                  <FormInput
                    value="1"
                    type="radio"
                    name="alarmNoteType"
                    text={_('Alarm notification and add to blacklist')}
                    checked={curData.alarmNoteType === '1'}
                    onChange={
                      item => this.onChangeSettings('alarmNoteType', item)
                    }
                  />
                </li>
              </ul>

            </FormGroup>
          </fieldset>
          <div className="form-group o-form__actions-bar">
            <div className="form-control">
              {
                app.get('saving') ? `${_('Saving')}...` : null
              }
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
