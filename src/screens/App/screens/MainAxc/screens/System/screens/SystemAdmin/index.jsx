import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
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
      showPrecondition: ($$data) => {
        return $$data.get('id') !== 1;
      },
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
    text: _('Password'),
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

  route: PropTypes.object,
  updateCurEditListItem: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onBeforeSave = this.onBeforeSave.bind(this);
  }

  onBeforeSave($$actionQuery, $$curListItem) {
    const actionType = $$actionQuery.get('action');
    const userType = $$curListItem.get('userType');

    if ('add,edit'.indexOf(actionType) !== -1) {
      if (userType === 0) {
        this.props.updateCurEditListItem({
          purview: PURVIEW_ADMIN,
        });
      } else if (userType === 2) {
        this.props.updateCurEditListItem({
          purview: PURVIEW_GUEST,
        });
      }
    }
  }

  render() {
    const { app, store, route } = this.props;
    const myStore = store.setIn(
      [route.id, 'data', 'list', 0, 'noDelete'],
      true,
    );
    const purview = app.getIn(['login', 'purview']);
    const isAdmin = purview === 'all';

    return (
      <AppScreen
        {...this.props}
        store={myStore}
        listOptions={listOptions}
        actionable={isAdmin}
        deleteable={
          ($$item, index) => (index !== 0)
        }
        onBeforeSave={this.onBeforeSave}
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
