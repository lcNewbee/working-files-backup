import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'basname',
    text: __('Bas Name'),
    className: 'col col-6',
    formProps: {
      required: true,
      maxLength: '31',
    },
  }, {
    id: 'bas_ip',
    text: __('Bas IP'),
    className: 'col col-6',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'bas_port',
    text: __('Bas Port'),
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'sharedSecret',
    text: __('Shared Secret'),
    formProps: {
      type: 'password',
      required: true,
    },
  }, {
    id: 'bas_user',
    text: __('User'),
    noTable: true,
    formProps: {
      required: true,
      type: 'text',
    },
  }, {
    id: 'bas_pwd',
    text: __('Password'),
    noTable: true,
    formProps: {
      required: true,
      type: 'password',
    },
  }, {
    id: 'bas',
    text: __('Device Type'),
    options: [
      {
        value: '0',
        label: __('Standard'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: __('Device Type'),
      placeholder: __('Please Select ') + __('Device Type'),
    },
  }, {
    id: 'portalVer',
    text: __('Portal Vertion'),
    options: [
      {
        value: '1',
        label: __('V1/CMCC'),
      }, {
        value: '2',
        label: __('V2'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: __('Portal Vertion'),
      placeholder: __('Please Select ') + __('Portal Vertion'),
    },
  }, {
    id: 'authType',
    text: __('Authentication Type'),
    options: [
      {
        value: '0',
        label: __('PAP'),
      }, {
        value: '1',
        label: __('CHAP'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: __('Authentication Type'),
      placeholder: __('Please Select ') + __('Authentication Type'),
    },
  }, {
    id: 'timeoutSec',
    text: __('Time out'),
    type: 'num',
    formProps: {
      min: '0',
      required: true,
    },
  }, {
    id: 'web',
    text: __('Web Template'),
    options: [
      {
        required: true,
        value: '0',
        label: __('Default Web'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      label: __('Web Template'),
      placeholder: __('Please Select ') + __('Web Template'),
    },
  }, {
    id: 'isPortalCheck',
    text: __('Portal Acc'),
    noForm: true,
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'isOut',
    text: __('Enviroment Deployment'),
    options: [
      {
        value: '0',
        label: __('Inside Network Deployment'),
      }, {
        value: '1',
        label: __('Outside Network Deployment'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: __('Enviroment Deployment'),
      placeholder: __('Please Select ') + __('Enviroment'),
    },
  }, {
    id: 'auth_interface',
    text: __('Interface Authentication'),
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'isComputer',
    text: __('Computer Authentication'),
    options: [
      {
        value: '0',
        label: __('Allowed'),
      }, {
        value: '1',
        label: __('Forbidden'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: __('Computer Authentication'),
      placeholder: __('Please Select ') + __('Computer Authentication'),
    },
  }, {
    id: 'isdebug',
    text: __('Debug'),
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'lateAuth',
    text: __('Late Authentication'),
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: __('Late Authentication'),
      placeholder: __('Please Select ') + __('Late Authentication'),
    },
  }, {
    id: 'lateAuthTime',
    text: __('Late Authtime'),
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
