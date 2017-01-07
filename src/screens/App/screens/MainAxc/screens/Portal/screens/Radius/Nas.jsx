import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const checkboxOptions = [
  {
    value: '0',
    label: _('OFF'),
  }, {
    value: '1',
    label: _('ON'),
  },
];
const listOptions = fromJS([
  {
    id: 'ip',
    text: _('IP'),
    type: 'text',
    validator: validator({
      rules: 'ip',
    }),
    formProps: {
      required: true,
    },
  }, {
    id: 'name',
    text: _('Name'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'sharedSecret',
    text: _('Shared Secret'),
    formProps: {
      type: 'password',
      required: true,
    },
  }, {
    id: 'ex2',
    text: _('Acc Send Interval'),
    defaultValue: '300',
    type: 'num',
    formProps: {
      required: true,
    },
  }, {
    id: 'ex3',
    text: _('Check Period'),
    defaultValue: '600',
    type: 'num',
    formProps: {
      required: true,
    },
  }, {
    id: 'ex4',
    text: _('Idle Time'),
    defaultValue: '600',
    type: 'num',
    formProps: {
      required: true,
    },
  }, {
    id: 'type',
    type: 'text',
    options: [
      {
        value: '0',
        label: _('Standard'),
      },
    ],
    noTable: true,
    noForm: true,
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Equipment Type'),
      placeholder: _('Please Select ') + _('Equipment Type'),
    },
  }, {
    id: 'description',
    text: _('Description'),
    type: 'text',
    required: 'true',
  }, {
    id: 'ex1',
    text: _('is Delegated'),
    defaultValue: '0',
    options: checkboxOptions,
    formProps: {
      type: 'checkbox',
      required: true,
    },
  }, {
    id: 'ex5',
    defaultValue: '0',
    text: _('Concurrency Unlock'),
    options: checkboxOptions,
    formProps: {
      form: 'port',
      type: 'checkbox',
      required: true,
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
