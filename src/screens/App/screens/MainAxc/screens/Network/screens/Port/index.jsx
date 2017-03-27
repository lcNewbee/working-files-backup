import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'workModel',
    text: __('Physical Mode'),
    options: [
      {
        value: 'half',
        label: __('Half Duplex'),
      }, {
        value: 'full',
        label: __('Full Duplex'),
      }, {
        value: 'auto',
        label: __('Auto'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  },
  {
    id: 'speed',
    text: __('Port Speed'),
    options: [
      {
        value: '10',
        label: '10',
      }, {
        value: '100',
        label: '100',
      }, {
        value: '1000',
        label: __('1000'),
      },
    ],
    formProps: {
      type: 'switch',
      visible(data) {
        return data.get('workModel') !== 'auto';
      },
    },
  }, {
    id: 'description',
    text: __('Description'),
    formProps: {
      type: 'textarea',
      maxLength: '31',
      validator: validator({
        rules: 'utf8Len:[0,31]',
      }),
    },
  }, {
    id: 'status',
    text: __('Port Status'),
    options: [
      {
        value: 1,
        label: __('ON'),
        render() {
          return (
            <span
              style={{
                color: 'green',
              }}
            >
              {__('ON')}
            </span>
          );
        },
      }, {
        value: 0,
        label: __('OFF'),
        render() {
          return (
            <span
              style={{
                color: 'red',
              }}
            >
              {__('OFF')}
            </span>
          );
        },
      },
    ],
    formProps: {
      type: 'checkbox',
      value: '1',
    },
  },
]);
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class NetworkPort extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        addable={false}
        deleteable={false}
        actionable
      />
    );
  }
}

NetworkPort.propTypes = propTypes;
NetworkPort.defaultProps = defaultProps;

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
)(NetworkPort);
