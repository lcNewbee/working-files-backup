import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import { countryOptions } from 'shared/config/axcRadio';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

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

const settingsFormOptions = fromJS([
  {
    id: 'countrycode',
    label: _('Country'),
    fieldset: 'retainDays',
    type: 'select',
    options: countryOptions,
    searchable: true,
  }, {
    id: 'discoverycnt',
    label: _('AP Number of Re-joins'),
    fieldset: 'retainDays',
    defaultValue: '7',
    type: 'number',
    min: '1',
    max: '365',
  }, {
    id: 'echotime',
    label: _('AP Heartbeat Time'),
    fieldset: 'retainDays',
    defaultValue: '7',
    type: 'number',
    min: '1',
    max: '365',
    help: _('Seconds'),
  }, {
    id: 'statistime',
    label: _('AP Data Reporting Time'),
    fieldset: 'retainDays',
    defaultValue: '7',
    type: 'number',
    min: '1',
    max: '365',
    help: _('Seconds'),
  }, {
    id: 'autoap',
    label: _('Allow Automatic Add AP'),
    fieldset: 'retainDays',
    defaultValue: '7',
    type: 'checkbox',
    value: '1',
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,
  fetch: PropTypes.func,
  createModal: PropTypes.func,
  closeModal: PropTypes.func,
  changeModalState: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsFormOptions}
        hasSettingsSaveButton
        noTitle
      />
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
