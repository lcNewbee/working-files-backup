import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormGroup, SaveButton, FormInput,
} from 'shared/components';
import * as appActions from 'shared/actions/app';

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

  render() {
    const { route, updateItemSettings } = this.props;
    const curData = this.props.store.getIn(['curData']).toJS();

    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }

    return (
      <form className="o-form">
        <FormGroup
          type="checkbox"
          id="enabled"
          label={_('Enable')}
          checked={curData.terminalRelease === '1'}
          onChange={item => updateItemSettings({
            terminalRelease: item.value,

          })}
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
            checked={curData.terminalRelease === '1'}
            onChange={item => updateItemSettings({
              terminalRelease: item.value,
            })}
          />
          <FormGroup
            value="1"
            type="checkbox"
            theme="square"
            text={_('Wireless Anti-spoofing Detection')}
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
                />
              </li>
              <li className="row">
                <FormInput
                  value="1"
                  type="radio"
                  name="alarmNoteType"
                  text={_('Alarm notification and add to blacklist')}
                />
              </li>
            </ul>

          </FormGroup>
        </fieldset>
        <div className="form-group o-form__actions-bar">
          <div className="form-control">
            <SaveButton
              type="button"
              loading={this.props.app.get('saving')}
              onClick={this.onSave}
            />
          </div>
        </div>
      </form>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupId: state.product.getIn(['group', 'selected', 'id']),
    store: state.settings,
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
  mapDispatchToProps,
)(View);
