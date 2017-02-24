import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import validator from 'shared/validator';

const propTypes = {
  params: PropTypes.object,
  updateScreenSettings: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
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
            id: item.id,
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
    utils.binds(this, [
      'onBeforeSync',
    ]);
  }
  componentWillMount() {
    getUserName()
      .then((data) => {
        this.setState({
          userNameOptions: fromJS(data.options),
        });
      });
  }
  // componentDidMount() {
  //   this.state = {
  //     options: this.props.params.toname,
  //   };
  // }
  onBeforeSync($$actionQuery, $$curSettings) {
    const optionList = this.state.userNameOptions;
    const id = optionList.find($$item => $$item.get('value') === $$curSettings.get('toname'),
      ).get('id');
    this.props.updateScreenSettings({
      id,
    });
  }
  render() {
    const { toname } = this.props.params;
    const curSettingOptions = settingsOptions
      .setIn([0, 'options'], this.state.userNameOptions);
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={curSettingOptions}
        initOption={{
          query: {
            toname,
          },
          actionQuery: {
            toname,
          },
        }}
        onBeforeSync={this.onBeforeSync}
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
