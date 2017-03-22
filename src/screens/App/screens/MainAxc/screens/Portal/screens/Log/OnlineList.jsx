import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const uptimeFilter = utils.filter('connectTime');
const flowFilter = utils.filter('flowRate');
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
    id: 'time',
    text: _('Online Time'),
    formProps: {
      required: true,
    },
    transform(val) {
      return uptimeFilter.transform(val / 1000);
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
        label: _('Free of Charge'),
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
    id: 'ins',
    text: _('Up Traffic'),
    formProps: {
      required: true,
    },
    transform(val) {
      return `${flowFilter.transform(val)}`;
    },
  }, {
    id: 'outs',
    text: _('Down Traffic'),
    formProps: {
      required: true,
    },
    transform(val) {
      return `${flowFilter.transform(val)}`;
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
    id: 'type',
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
    id: '__actions__',
    text: _('Actions'),
    actions: [
      {
        icon: 'arrow-down',
        actionName: 'delete',
        text: _('Offline'),
      },
    ],
  },
]);

const listActionBarButtons = [
  {
    actionName: 'delete',
    text: _('Batch Offline'),
    icon: 'arrow-down',
  },
];
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
    const myActionButtons = listActionBarButtons;
    return (
      <AppScreen
        {...this.props}
        actionBarButtons={myActionButtons}
        listOptions={listOptions}
        actionable
        selectable
        addable={false}
        editable={false}
        deleteable={false}
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
