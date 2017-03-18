import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'phoneNumber',
    text: _('Phone Number'),
    formProps: {
      type: 'text',
      required: true,
      maxLength: '22',
      validator: validator({
        rules: 'utf8Len:[1, 20]',
      }),
    },
  }, {
    id: 'mContent',
    text: _('Message Content'),
    formProps: {
      maxLength: '257',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 256]',
      }),
    },
  }, {
    id: 'date',
    text: _('Date'),
    formProps: {
      type: 'date',
      required: true,
    },
  }, {
    id: 'gatewayType',
    text: _('Gate Type'),
  },
]);

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};
export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        noTitle
        actionable
        selectable
        addable={false}
        editable={false}
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
