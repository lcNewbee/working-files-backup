import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormGroup, Button,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';

const languageOptions = List(b28n.getOptions().supportLang).map((item) => (
  {
    value: item,
    label: b28n.langMap[item] || 'English',
  }
)).toJS();

function onChangeLang(data) {
  if (b28n.getLang() !== data.value) {
    b28n.setLang(data.value);
    window.location.reload();
  }
}

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
      query: {
        groupId,
      },
      defaultData: {
        enable: '1',
      },
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
        <legend className="o-form__legend">{route.text}</legend>
        <FormGroup label={_('Reboot Device')}>
          <Button
            type="button"
            icon="refresh"
            text={_('Reboot Now')}
            loading={this.props.app.get('saving')}
            onClick={this.onSave}
          />
        </FormGroup>
        <fileset>
          <legend className="o-form__legend">{_('Restore Configuration')}</legend>
          <FormGroup label={_('Restore From File')}>
            <input
              type="file"
              style={{
                marginBottom: '4px',
              }}
            />
            <br />
            <Button
              type="button"
              icon="undo"
              text={_('Restore Now')}
              loading={this.props.app.get('saving')}
              onClick={this.onSave}
            />
          </FormGroup>
        </fileset>

        <fileset>
          <legend className="o-form__legend">{_('Language')}</legend>
          <FormGroup
            label={_('Current')}
            type="select"
            options={languageOptions}
            value={b28n.getLang()}
            onChange={onChangeLang}
          />
        </fileset>
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
    actions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
