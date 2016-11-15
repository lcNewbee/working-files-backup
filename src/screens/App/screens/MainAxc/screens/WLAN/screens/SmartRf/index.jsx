import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormGroup, SaveButton, FormInput,
} from 'shared/components';
import AppScreen from 'shared/components/Template/AppScreen';
import channels from 'shared/config/country.json';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const channelsList = List(channels);
const countryOptions = channelsList.map(item => ({
  value: item.country,
  label: b28n.getLang() === 'cn' ? _(item.cn) : _(item.en),
})).toJS();

const propTypes = {
  app: PropTypes.instanceOf(Map),
  screenStore: PropTypes.instanceOf(Map),
  groupid: PropTypes.any,

  changeScreenQuery: PropTypes.func,
  fetchScreenData: PropTypes.func,
  updateScreenSettings: PropTypes.func,
  saveScreenSettings: PropTypes.func,
};
const defaultProps = {};

export default class SmartRf extends React.Component {
  constructor(props) {
    const groupid = props.groupid || -1;

    super(props);
    this.state = {
      defaultSettingsData: {
        '5gFrist': '1',
        '11nFrist': '1',
        terminalRelease: '1',
        terminalReleaseVal: '75',
        autoPower: '1',
        autoChannel: '1',
        wirelessPower: '20',
        country: 'CN',
        channel: '6',
        groupid,
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.groupid !== prevProps.groupid) {
      this.props.updateScreenSettings({
        groupid: this.props.groupid,
      });
      this.props.changeScreenQuery({
        groupid: this.props.groupid,
      });
      this.props.fetchScreenData();
    }
  }

  render() {
    const { app, screenStore, updateScreenSettings } = this.props;
    const { defaultSettingsData } = this.state;
    const myScreenId = screenStore.get('curScreenId');
    const curData = screenStore.getIn([myScreenId, 'curSettings']).toJS();

    return (
      <AppScreen
        {...this.props}
        store={screenStore}
        defaultSettingsData={defaultSettingsData}
        noTitle
      >
        <form className="o-form">
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Base Settings')}</legend>
            <FormGroup
              type="checkbox"
              label={_('Band Steering')}
              checked={curData['5gFrist'] === '1'}
              onChange={item => updateScreenSettings({
                '5gFrist': item.value,
              })}
            />
            <FormGroup
              label={_('Terminal Release')}
              value={curData.terminalReleaseVal}
            >
              <FormInput
                type="checkbox"
                checked={curData.terminalRelease === '1'}
                onChange={item => updateScreenSettings({
                  terminalRelease: item.value,
                })}
              />
              <FormInput
                type="text"
                value={curData.terminalReleaseVal}
                maxLength="3"
                size="sm"
                disabled={curData.terminalRelease !== '1'}
                onChange={item => updateScreenSettings({
                  terminalReleaseVal: item.value,
                })}
              />
            </FormGroup>
            <FormGroup
              type="checkbox"
              label={_('11n Frist')}
              checked={curData['11nFrist'] === '1'}
              onChange={item => updateScreenSettings({
                '11nFrist': item.value,
              })}
            />
          </fieldset>
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Tx Power')}</legend>
            <FormGroup
              type="checkbox"
              label={_('Automatic')}
              checked={curData.autoBandwidth === '1'}
              onChange={item => updateScreenSettings({
                autoBandwidth: item.value,
              })}
            />
            {
              curData.autoBandwidth !== '1' ? (
                <FormGroup
                  type="range"
                  min="1"
                  max="100"
                  label={_('Tx Power')}
                  unit="%"
                  value={parseInt(curData.wirelessPower, 10)}
                  onChange={item => updateScreenSettings({
                    wirelessPower: item.value,
                  })}
                />
              ) : null
            }
          </fieldset>
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Channel')}</legend>
            <FormGroup
              type="select"
              label={_('Country')}
              options={countryOptions}
              value={curData.country}
              onChange={item => updateScreenSettings({
                country: item.value,
              })}
            />
            <FormGroup
              type="checkbox"
              label={_('Automatic')}
              value="1"
              checked={curData.autoChannel === '1'}
              onChange={item => updateScreenSettings({
                autoChannel: item.value,
              })}
            />

            <div className="form-group form-group--save">
              <div className="form-control">
                <SaveButton
                  type="button"
                  loading={app.get('saving')}
                  onClick={this.props.saveScreenSettings}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </AppScreen>
    );
  }
}

SmartRf.propTypes = propTypes;
SmartRf.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    screenStore: state.screens,
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
)(SmartRf);
