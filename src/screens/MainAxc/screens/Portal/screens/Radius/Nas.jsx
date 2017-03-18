import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const onlinetimeFilter = utils.filter('connectTime');

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
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'name',
    text: _('Name'),
    formProps: {
      type: 'text',
      required: true,
      maxLength: '33',
      validator: validator({
        rules: 'utf8Len:[1,32]',
      }),
    },
  }, {
    id: 'sharedSecret',
    text: _('Shared Secret'),
    formProps: {
      type: 'password',
      required: true,
      maxLength: '33',
      validator: validator({
        rules: 'utf8Len:[1,32]',
      }),
    },
  }, {
    id: 'ex2',
    text: _('Acc Send Interval'),
    defaultValue: '300',
    formProps: {
      type: 'number',
      help: _('Seconds'),
      min: '0',
      max: '99999999',
      required: true,
    },
    transform(val) {
      return onlinetimeFilter.transform(val);
    },
  }, {
    id: 'ex3',
    text: _('Check Period'),
    formProps: {
      defaultValue: '600',
      help: _('Seconds'),
      min: '0',
      max: '99999999',
      type: 'number',
      required: true,
    },
    transform(val) {
      return onlinetimeFilter.transform(val);
    },
  }, {
    id: 'ex4',
    text: _('Idle Time'),
    defaultValue: '600',
    formProps: {
      help: _('Second'),
      min: '0',
      max: '99999999',
      type: 'number',
      required: true,
    },
    transform(val) {
      return onlinetimeFilter.transform(val);
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
    formProps: {
      type: 'textarea',
      required: true,
      maxLength: '257',
      validator: validator({
        rules: 'utf8Len:[1,256]',
      }),
    },
  }, {
    id: 'ex1',
    text: _('is Delegated'),
    defaultValue: '0',
    options: checkboxOptions,
    formProps: {
      type: 'switch',
      required: true,
    },
  }, {
    id: 'ex5',
    defaultValue: '0',
    text: _('Concurrency Unlock'),
    options: checkboxOptions,
    formProps: {
      type: 'switch',
      required: true,
    },
  },
]);
const propTypes = {
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
