import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import validator from 'shared/validator';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};
const defaultProps = {};

function getUserName() {
  return utils.fetch('goform/portal/account/accountList', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.loginName,
            label: item.loginName,
          }),
        ),
      }
    ),
  );
}
const settingsOptions = fromJS([
  // {
  //   id: 'toPos',
  //   label: _('toPos'),
  //   fieldset: 'send_message',
  //   legend: _('Send Message'),
  //   type: 'select',
  //   options: [
  //     {
  //       value: '0',
  //       label: _('System User'),
  //     }, {
  //       value: '1',
  //       label: _('AP User'),
  //     },
  //   ],
  //   required: true,
  //   validator: validator({
  //     rules: 'utf8Len:[1,255]',
  //   }),
  // },
  {
    id: 'toname',
    label: _('Receiver'),
    fieldset: 'send_message',
    legend: _('Send Message'),
    required: true,
    type: 'select',
    validator: validator({
      rules: 'utf8Len:[1,255]',
    }),
  },
  {
    id: 'title',
    label: _('Title'),
    fieldset: 'send_message',
    type: 'text',
    required: true,
    legend: _('Send Message'),
    validator: validator({
      rules: 'utf8Len:[1,255]',
    }),
  },
  {
    id: 'description',
    label: _('Content'),
    fieldset: 'send_message',
    type: 'textarea',
    required: true,
    validator: validator({
      rules: 'utf8Len:[1,255]',
    }),
  },
]);

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameOptions: fromJS([]),
    };
  }
  componentWillMount() {
    getUserName()
      .then((data) => {

        this.setState({
          userNameOptions: fromJS(data.options),
        });
      });
  }
  render() {
    const curSettingOptions = settingsOptions
      .setIn([0, 'options'], this.state.userNameOptions);
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={curSettingOptions}
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
