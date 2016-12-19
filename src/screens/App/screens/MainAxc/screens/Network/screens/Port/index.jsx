import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'workModel',
    text: _('Physical Mode'),
    options: [
      {
        value: 'half',
        label: _('Simplex'),
      }, {
        value: 'full',
        label: _('Duplex'),
      }, {
        value: 'auto',
        label: _('Auto'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  },
  {
    id: 'speed',
    text: _('Port Speed'),
    options: [
      {
        value: '10',
        label: '10',
      }, {
        value: '100',
        label: '100',
      }, {
        value: '1000',
        label: _('1000'),
      },
    ],
    formProps: {
      type: 'switch',
      showPrecondition(data) {
        return data.get('workModel') !== 'auto';
      },
    },
  }, {
    id: 'description',
    text: _('Description'),
    formProps: {
      type: 'textarea',
      maxLength: '64',
    },
  }, {
    id: 'status',
    text: _('Port Status'),
    options: [
      {
        value: 1,
        label: _('ON'),
        render() {
          return (
            <span
              style={{
                color: 'green',
              }}
            >
              {_('ON')}
            </span>
          );
        },
      }, {
        value: 0,
        label: _('OFF'),
        render() {
          return (
            <span
              style={{
                color: 'red',
              }}
            >
              {_('OFF')}
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
