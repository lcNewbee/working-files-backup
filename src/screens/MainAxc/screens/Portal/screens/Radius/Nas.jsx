import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const onlinetimeFilter = utils.filter('connectTime');

const checkboxOptions = [
  {
    value: '0',
    label: __('OFF'),
  }, {
    value: '1',
    label: __('ON'),
  },
];
const listOptions = fromJS([
  {
    id: 'ip',
    text: __('IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'name',
    text: __('Name'),
    formProps: {
      type: 'text',
      required: true,
      maxLength: '129',
      validator: validator({
        rules: 'utf8Len:[1,128]',
      }),
    },
  }, {
    id: 'sharedSecret',
    text: __('Shared Secret'),
    formProps: {
      type: 'password',
      required: true,
      maxLength: '129',
      validator: validator({
        rules: 'utf8Len:[1,128]',
      }),
    },
  }, {
    id: 'ex2',
    text: __('Acc Send Interval'),
    defaultValue: '300',
    formProps: {
      type: 'number',
      help: __('Seconds'),
      min: '0',
      max: '99999999',
      required: true,
    },
    transform(val) {
      return onlinetimeFilter.transform(val);
    },
  }, {
    id: 'ex3',
    text: __('Check Period'),
    formProps: {
      defaultValue: '600',
      help: __('Seconds'),
      min: '0',
      max: '99999999',
      type: 'number',
      validator: validator({
        rules: 'num:[0,99999999]',
      }),
      required: true,
    },
    transform(val) {
      return onlinetimeFilter.transform(val);
    },
  }, {
    id: 'ex4',
    text: __('Idle Time'),
    defaultValue: '600',
    formProps: {
      help: __('Second'),
      min: '0',
      max: '99999999',
      type: 'number',
      validator: validator({
        rules: 'num:[0,99999999]',
      }),
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
        label: __('Standard'),
      },
    ],
    noTable: true,
    noForm: true,
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: __('Equipment Type'),
      placeholder: __('Please Select ') + __('Equipment Type'),
    },
  }, {
    id: 'description',
    text: __('Description'),
    formProps: {
      type: 'textarea',
      maxLength: '256',
      validator: validator({
        rules: 'utf8Len:[1,255]',
      }),
    },
  }, {
    id: 'ex1',
    text: __('is Delegated'),
    defaultValue: '0',
    options: checkboxOptions,
    formProps: {
      type: 'switch',
      required: true,
    },
  }, {
    id: 'ex5',
    defaultValue: '0',
    text: __('Concurrency Unlock'),
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
        searchable
        searchProps={{
          placeholder: `${__('Name')}/IP`,
        }}
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
