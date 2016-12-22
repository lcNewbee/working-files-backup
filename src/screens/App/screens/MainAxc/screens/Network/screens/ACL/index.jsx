import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const commonFormOptions = fromJS([
  {
    id: 'enable',
    label: _('ACL'),
    type: 'checkbox',
    text: _('Enable'),
    value: '1',
    saveOnChange: true,
  },
]);
const listOptions = fromJS([
  {
    id: 'ruleName',
    label: _('Name'),
    formProps: {
      type: 'text',
      maxLength: '32',
      required: true,
    },
  }, {
    id: 'ruleAction',
    label: _('Rule'),
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: _('Allow'),
      }, {
        value: '1',
        label: _('Prevent'),
      },
    ],
    formProps: {
      type: 'switch',
    },

  }, {
    id: 'addressType',
    label: _('Address Type'),
    options: [
      {
        value: '1',
        label: _('Source IP Address'),
      }, {
        value: '2',
        label: _('Target IP Address'),
      },
    ],
    formProps: {
      type: 'select',
      label: _('Address Type'),
      placeholder: _('Please Select ') + _('NAT Rule Type'),
    },

  }, {
    id: 'ipAddress',
    label: _('IP Address'),
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
        listTitle={_('ACL List')}
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
