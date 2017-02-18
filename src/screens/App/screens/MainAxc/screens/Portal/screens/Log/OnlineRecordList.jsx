import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'ip',
    text: _('IP'),
    type: 'text',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'basip',
    text: _('Bas IP'),
    type: 'text',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mac',
    text: _('Mac'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'loginName',
    text: _('Login Name'),
    formProps: {
      required: true,
    },
  }, {
    id: 'startDate',
    text: _('Online Date'),
    formProps: {
      required: true,
    },
  }, {
    id: 'endDate',
    text: _('Offline Date'),
    formProps: {
      required: true,
    },
  }, {
    id: 'time',
    text: _('Online Time'),
    formProps: {
      required: true,
    },
  }, {
    id: 'state',
    text: _('Acc Type'),
    options: [
      {
        value: '0',
        label: _('Unavailability'),
      }, {
        value: '1',
        label: _('Free'),
      },
      {
        value: '2',
        label: _('Timekeeping'),
      }, {
        value: '3',
        label: _('Buy Out'),
      }, {
        value: '4',
        label: _('Traffic'),
      }, {
        value: '-1',
        label: _('Outside User'),
      },
    ],
  }, {
    id: 'time',
    text: _('Time'),
    formProps: {
      required: true,
    },
  }, {
    id: 'ins',
    text: _('Up Traffic'),
    formProps: {
      required: true,
    },
  }, {
    id: 'outs',
    text: _('Down Traffic'),
    formProps: {
      required: true,
    },
  }, {
    id: 'octets',
    text: _('Used Traffic'),
    formProps: {
      required: true,
    },
  }, {
    id: 'basname',
    text: _('Bas Name'),
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'ssid',
    text: _('SSID'),
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'apmac',
    text: _('AP Mac'),
    formProps: {
      required: true,
    },
  }, {
    id: 'methodtype',
    text: _('Authetication Type'),
    formProps: {
      required: true,
    },
  }, {
    id: 'auto',
    text: _('Auto Log'),
    formProps: {
      required: true,
    },
  }, {
    id: 'agent',
    text: _('Client'),
    formProps: {
      required: true,
    },
  }, {
    id: 'ex1',
    text: _('Reason'),
    formProps: {
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
        addable={false}
        editable={false}
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
