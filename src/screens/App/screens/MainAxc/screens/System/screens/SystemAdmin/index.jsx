import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import { FormGroup } from 'shared/components/Form';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'userType',
    width: '160',
    text: _('User Type'),
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: _('Admin'),
      }, {
        value: '1',
        label: _('Manager(Branch)'),
      }, {
        value: '2',
        label: _('Manager(Read-only)'),
      },
    ],
    formProps: {
      type: 'switch',
      minWidth: '100px',
    },
  }, {
    id: 'purview',
    width: '160',
    text: _('Purview'),
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: 'Portal',
      }, {
        value: '1',
        label: 'AP',
      }, {
        value: '3',
        label: 'Network',
      }, {
        value: '4',
        label: 'System',
      }, {
        value: '5',
        label: 'System2',
      },
    ],

    formProps: {
      component(option, ...rest) {
        const myProps = option;

        if (rest[0].get('userType') !== '1') {
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
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
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
    const { store, route } = this.props;
    const myStore = store.setIn(
      [route.id, 'data', 'list', 0, 'noDelete'],
      true,
    );
    return (
      <AppScreen
        {...this.props}
        store={myStore}
        listOptions={listOptions}
        actionable
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
