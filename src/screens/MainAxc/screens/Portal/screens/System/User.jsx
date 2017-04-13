import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'loginName',
    text: __('Login Name'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'password',
    text: __('Password'),
    type: 'password',
    formProps: {
      required: true,
    },
    noTable: true,
  }, {
    id: 'name',
    text: __('Name'),
    type: 'text',
  }, {
    id: 'gender',
    text: __('Gender'),
    type: 'select',
    noTable: true,
    options: [
      {
        value: '0',
        label: __('Male'),
      }, {
        value: '1',
        label: __('Female'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      placeholder: __('Please Select ') + __('Gender'),
    },
  }, {
    id: 'phoneNumber',
    text: __('Phone Number'),
    noTable: true,
    type: 'text',
  }, {
    id: 'email',
    text: __('Email'),
    noTable: true,
    type: 'text',
  }, {
    id: 'description',
    text: __('Detail Description'),
    type: 'text',
  }, {
    id: 'departmentId',
    text: __('Belonged Classification'),
    type: 'text',
    options: [
      {
        value: '0',
        label: __('Super Administrator'),
      }, {
        value: '1',
        label: __('Operator'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      placeholder: __('Please Select ') + __('Belonged Classification'),
    },
  }, {
    id: 'roleId',
    text: __('Role Name'),
    options: [
      {
        value: '0',
        label: __('Super Administrator'),
      }, {
        value: '1',
        label: __('Operator'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      placeholder: __('Please Select ') + __('Role Name'),
    },
  },
]);
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class OpenPortalBase extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
        }
      });
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        actionable
        selectable
      />
    );
  }
}

OpenPortalBase.propTypes = propTypes;
OpenPortalBase.defaultProps = defaultProps;

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
)(OpenPortalBase);
