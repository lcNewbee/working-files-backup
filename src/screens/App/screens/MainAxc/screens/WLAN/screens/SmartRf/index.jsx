import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormGroup, SaveButton, FormInput,
} from 'shared/components';
import channels from 'shared/config/country.json';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';

const channelsList = List(channels);
const countryOptions = channelsList.map((item) => ({
  value: item.country,
  label: b28n.getLang() === 'cn' ? _(item.cn) : _(item.en),
})).toJS();

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }
  componentWillMount() {
    const props = this.props;
    const groupId = props.groupId || -1;

    props.initSettings({
      settingId: props.route.id,
      formUrl: props.route.formUrl,
      defaultData: {
        '5gFrist': '1',
        '11nFrist': '1',
        terminalRelease: '1',
        terminalReleaseVal: '75',
        autoPower: '1',
        autoChannel: '1',
        wirelessPower: '20',
        country: 'CN',
        channel: '6',
      },
      query: {
        groupId,
      },
      saveQuery: {},
    });

    props.fetchSettings();
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }
  onSave() {
    this.props.saveSettings();
  }

  getChannelsOptions(currCountry) {
    let i;
    let len;
    let channelsRange;
    const channelsOptions = [
      {
        value: '0',
        label: _('auto'),
      },
    ];
    const channelsOption = channelsList.find((item) => {
      return item.country === currCountry;
    });

    if (channelsOption) {
      channelsRange = channelsOption['2.4g'].split('-');
      i = parseInt(channelsRange[0], 10);
      len = parseInt(channelsRange[1], 10);
    } else {
      i = 1;
      len = 13;
    }

    for (i; i <= len; i++) {
      channelsOptions.push({
        value: `${i}`,
        label: `${i}`,
      });
    }

    return channelsOptions;
  }

  render() {
    const { route, updateItemSettings } = this.props;
    const curData = this.props.store.getIn(['curData']).toJS();
    const channelsOptions = this.getChannelsOptions(curData.country);

    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }

    return (
      <form className="o-form">
        <h2 className="o-form__title">{route.text}</h2>
        <fieldset className="o-form__fieldset">
          <legend className="o-form__legend">{_('Base Settings')}</legend>
          <FormGroup
            type="checkbox"
            label={_('5G优先')}
            checked={curData['5gFrist'] === '1'}
            onChange={(item) => updateItemSettings({
              '5gFrist': item.value,
            })}
          />
          <FormGroup
            label={_('终端防粘')}
            value={curData.terminalReleaseVal}
          >
            <FormInput
              type="checkbox"
              checked={curData.terminalRelease === '1'}
              onChange={(item) => updateItemSettings({
                terminalRelease: item.value,
              })}
            />
            <FormInput
              type="text"
              value={curData.terminalReleaseVal}
              maxLength="3"
              size="sm"
              disabled={curData.terminalRelease !== '1'}
              onChange={(item) => updateItemSettings({
                terminalReleaseVal: item.value,
              })}
            />
          </FormGroup>
          <FormGroup
            type="checkbox"
            label={_('11n优先')}
            checked={curData['11nFrist'] === '1'}
            onChange={(item) => updateItemSettings({
              '11nFrist': item.value,
            })}
          />
        </fieldset>
        <fieldset className="o-form__fieldset">
          <legend className="o-form__legend">{_('Wireless Power')}</legend>
          <FormGroup
            type="checkbox"
            label={_('自动功率')}
            checked={curData.autoBandwidth === '1'}
            onChange={(item) => updateItemSettings({
              autoBandwidth: item.value,
            })}
          />
          {
            curData.autoBandwidth !== '1' ? (
              <FormGroup
                type="range"
                min="1"
                max="100"
                label={_('Wireless Power')}
                help={`${curData.wirelessPower}%`}
                value={parseInt(curData.wirelessPower, 10)}
                onChange={(item) => updateItemSettings({
                  wirelessPower: item.value,
                })}
              />
            ) : null
          }
        </fieldset>
        <fieldset className="o-form__fieldset">
          <legend className="o-form__legend">{_('Wireless Channel')}</legend>
          <FormGroup
            type="select"
            label={_('Country')}
            options={countryOptions}
            value={curData.country}
            onChange={(item) => updateItemSettings({
              country: item.value,
            })}
          />
          <FormGroup
            type="checkbox"
            label={_('自动信道')}
            value="1"
            checked={curData.autoChannel === '1'}
            onChange={(item) => updateItemSettings({
              autoChannel: item.value,
            })}
          />
          {
            curData.autoChannel !== '1' ? (
              <FormGroup
                type="select"
                label={_('Channel')}
                options={channelsOptions}
                value={curData.channel}
                onChange={(item) => updateItemSettings({
                  channel: item.value,
                })}
              />
            ) : null
          }

          <div className="form-group form-group--save">
            <div className="form-control">
              <SaveButton
                type="button"
                loading={this.props.app.get('saving')}
                onClick={this.onSave}
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupId: state.mainAxc.getIn(['group', 'selected', 'id']),
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
