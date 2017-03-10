import React from 'react';
import { fromJS, isList } from 'immutable';
import { AppScreen } from 'shared/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const listOptions = fromJS([
  {
    id: 'id',
    type: 'text',
    text: _('Rule ID'),
    formProps: {
      noAdd: true,
    },
    notEditable: true,
  },
  {
    id: 'ruleName',
    text: _('Rule Name'),
    type: 'text',
  },
  {
    id: 'action',
    text: _('Action'),
    type: 'select',
    options: [
      { label: _('Accept'), value: 'accept' },
      { label: _('Reject'), value: 'reject' },
      { label: _('Redirect'), value: 'redirect' },
    ],
    formProps: {
      type: 'select',
    },
  },
  {
    id: 'destType',
    text: _('Destination Type'),
    type: 'select',
    options: [
      { label: _('Source IP'), value: 'src' },
      { label: _('Destination IP'), value: 'dest' },
    ],
    formProps: {
      type: 'select',
    },
  },
  {
    id: 'ipType',
    type: 'select',
    text: _('IP Type'),
    options: [
      { label: 'IPV4', value: 'ipv4' },
      { label: 'IPV6', value: 'ipv6' },
    ],
    formProps: {
      type: 'select',
    },
  },
  {
    id: 'ipTable',
    type: 'text',
    text: _('IP Table'),
    formProps: {
      type: 'textarea',
    }
  },
]);

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        addable
        deleteable
        actionable
        editable
        selectable
      />
    );
  }
}

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

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
