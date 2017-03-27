import React from 'react';
import { fromJS, isList } from 'immutable';
import { AppScreen } from 'shared/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions } from 'shared/containers/appScreen';

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.groupNameListOptions = fromJS([]);
  }

  componentWillMount() {
    // 请求Rule Group页面的组信息
    this.props.fetch('goform/network/extendacl/rulegroup', { page: 'all' })
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            const list = fromJS(json.data.list);
            this.groupNameListOptions = list.map((item) => {
              const name = item.get('groupName');
              const groupId = item.get('id');
              return { label: name, value: groupId };
            });
          }
        });
    this.props.fetch('goform/network/extendacl/ruledetails', { page: 'all' })
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            const list = fromJS(json.data.list);
            this.ruleDetailsListOptions = list.map((item) => {
              const name = item.get('ruleName');
              const ruleId = item.get('id');
              return { label: name, value: ruleId };
            });
          }
        });
  }

  render() {
    const listOptions = fromJS([
      {
        id: 'groupId',
        type: 'text',
        text: __('Group ID'),
        formProps: {
          noAdd: true,
        },
        notEditable: true,
      },
      {
        id: 'groupName',
        text: __('Group Name'),
        options: this.groupNameListOptions,
        formProps: {
          type: 'select',
        },
      },
      {
        id: 'ruleId',
        text: __('Action'),
        type: 'text',
        formProps: {
          type: 'select',
          multi: true,
          options: this.ruleDetailsListOptions,
        },
      },
    ]);

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
