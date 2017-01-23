import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'loginName',
    text: _('Login Name'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'password',
    text: _('Password'),
    type: 'password',
    formProps: {
      required: true,
    },
    noTable: true,
  }, {
    id: 'name',
    text: _('Name'),
    type: 'text',
  }, {
    id: 'gender',
    text: _('Gender'),
    type: 'select',
    noTable: true,
    options: [
      {
        value: '0',
        label: _('Male'),
      }, {
        value: '1',
        label: _('Female'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Gender'),
    },
  }, {
    id: 'phoneNumber',
    text: _('Phone Number'),
    noTable: true,
    type: 'text',
  }, {
    id: 'email',
    text: _('Email'),
    noTable: true,
    type: 'text',
  }, {
    id: 'description',
    text: _('Detail Description'),
    type: 'text',
  }, {
    id: 'departmentId',
    text: _('Belonged Classification'),
    type: 'text',
    options: [
      {
        value: '0',
        label: _('Super Administrator'),
      }, {
        value: '1',
        label: _('Operator'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Belonged Classification'),
    },
  }, {
    id: 'roleId',
    text: _('Role Name'),
    options: [
      {
        value: '0',
        label: _('Super Administrator'),
      }, {
        value: '1',
        label: _('Operator'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Role Name'),
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
