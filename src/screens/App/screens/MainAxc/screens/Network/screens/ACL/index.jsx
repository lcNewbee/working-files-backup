import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions } from 'shared/containers/appScreen';

const commonFormOptions = fromJS([
  {
    id: 'enable',
    label: __('ACL'),
    type: 'checkbox',
    text: __('Enable'),
    value: '1',
    saveOnChange: true,
  },
]);
const listOptions = fromJS([
  {
    id: 'ruleName',
    label: __('Name'),
    formProps: {
      type: 'text',
      maxLength: '32',
      required: true,
    },
  }, {
    id: 'ruleAction',
    label: __('Rule'),
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: __('Allow'),
      }, {
        value: '1',
        label: __('Prevent'),
      },
    ],
    formProps: {
      type: 'switch',
    },

  }, {
    id: 'addressType',
    label: __('Address Type'),
    options: [
      {
        value: '1',
        label: __('Source IP Address'),
      }, {
        value: '2',
        label: __('Target IP Address'),
      },
    ],
    formProps: {
      type: 'select',
      label: __('Address Type'),
      placeholder: __('Please Select ') + __('NAT Rule Type'),
    },

  }, {
    id: 'ipAddress',
    label: __('IP Address'),
    formProps: {
      required: true,
    },
  },
]);

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listTitle={__('ACL List')}
        store={this.props.store}
        listOptions={listOptions}
        settingsFormOptions={commonFormOptions}
        actionable
        selectable
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
