import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import { FormGroup } from 'shared/components/Form';
import {
  purviewOptions, PURVIEW_ADMIN, PURVIEW_GUEST,
} from 'shared/config/axc';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'userType',
    width: '160',
    text: _('User Type'),
    defaultValue: 1,
    options: [
      {
        value: 0,
        label: _('Admin'),
      }, {
        value: 1,
        label: _('Manager(Branch)'),
      }, {
        value: 2,
        label: _('Manager(Read-only)'),
      },
    ],
    formProps: {
      type: 'switch',
      minWidth: '100px',
      showPrecondition: $$data => $$data.get('id') !== 1,
    },
  }, {
    id: 'purview',
    width: '160',
    text: _('Purview'),
    defaultValue: '',
    options: purviewOptions,
    multi: true,
    formProps: {
      component(option, ...rest) {
        const myProps = option;

        if (rest[0].get('userType') !== 1) {
          return null;
        }

        return (
          <FormGroup
            {...myProps}
            type="select"
            multi
          />
        );
      },
    },
  }, {
    id: 'userName',
    width: '200',
    text: _('User Name'),
    defaultValue: '',
    formProps: {
      required: true,
      validator: validator({
        rules: 'len:[1,32]',
      }),
    },
  }, {
    id: 'userPassword',
    text: _('New Password'),
    noTable: true,
    defaultValue: '',
    formProps: {
      type: 'password',
      required: true,
      validator: validator({
        rules: 'len:[8,32]',
      }),
    },
  }, {
    id: 'confirmPassword',
    text: _('Confirm Password'),
    noTable: true,
    defaultValue: '',
    formProps: {
      type: 'password',
      required: true,
      validator: validator({
        rules: 'len:[8,32]',
      }),
    },
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  changeLoginStatus: PropTypes.func.isRequired,
  updateCurEditListItem: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onBeforeSave',
      'onAfterSync',
    ]);
  }

  onBeforeSave($$actionQuery, $$curListItem) {
    const actionType = $$actionQuery.get('action');
    const userType = $$curListItem.get('userType');
    let ret = null;

    if ('add,edit'.indexOf(actionType) !== -1) {
      if (this.props.app.get('invalid').isEmpty() &&
          $$curListItem.get('userPassword') !== $$curListItem.get('confirmPassword')) {
        ret = _('New password and confirm password must match');
      } else if (userType === 0) {
        this.props.updateCurEditListItem({
          purview: PURVIEW_ADMIN,
        });
      } else if (userType === 2) {
        this.props.updateCurEditListItem({
          purview: PURVIEW_GUEST,
        });
      }
    }

    return ret;
  }
  onAfterSync(option) {
    const editUsername = option.subData.userName;
    const loginUsername = this.props.app.getIn(['login', 'username']);

    if (option.subData.action === 'edit' && editUsername === loginUsername) {
      this.props.changeLoginStatus('0');
      window.location.hash = '#';
    }
  }

  render() {
    const { app } = this.props;
    const purview = app.getIn(['login', 'purview']);
    const isAdmin = purview === 'all';

    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        actionable={isAdmin}
        deleteable={
          ($$item, index) => (index !== 0)
        }
        onBeforeSave={this.onBeforeSave}
        onAfterSync={this.onAfterSync}
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
