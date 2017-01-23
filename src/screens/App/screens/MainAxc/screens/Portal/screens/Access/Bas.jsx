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
    id: 'basname',
    text: _('Bas Name'),
    className: 'col col-6',
    formProps: {
      required: true,
      maxLength: '31',
    },
  }, {
    id: 'bas_ip',
    text: _('Bas IP'),
    className: 'col col-6',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'bas_port',
    text: _('Bas Port'),
    noTable: true,
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
    id: 'bas_user',
    text: _('User'),
    noTable: true,
    formProps: {
      required: true,
      type: 'text',
    },
  }, {
    id: 'bas_pwd',
    text: _('Password'),
    noTable: true,
    formProps: {
      required: true,
      type: 'password',
    },
  }, {
    id: 'bas',
    text: _('Device Type'),
    options: [
      {
        value: '0',
        label: _('Standard'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: _('Device Type'),
      placeholder: _('Please Select ') + _('Device Type'),
    },
  }, {
    id: 'portalVer',
    text: _('Portal Vertion'),
    options: [
      {
        value: '1',
        label: _('V1/CMCC'),
      }, {
        value: '2',
        label: _('V2'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: _('Portal Vertion'),
      placeholder: _('Please Select ') + _('Portal Vertion'),
    },
  }, {
    id: 'authType',
    text: _('Auth Type'),
    options: [
      {
        value: '0',
        label: _('PAP'),
      }, {
        value: '1',
        label: _('CHAP'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: _('Auth Type'),
      placeholder: _('Please Select ') + _('Auth Type'),
    },
  }, {
    id: 'timeoutSec',
    text: _('Time out'),
    type: 'num',
    formProps: {
      min: '0',
      required: true,
    },
  }, {
    id: 'web',
    text: _('Web Template'),
    options: [
      {
        required: true,
        value: '0',
        label: _('Default Web'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      label: _('Web Template'),
      placeholder: _('Please Select ') + _('Web Template'),
    },
  }, {
    id: 'isPortalCheck',
    text: _('Portal Acc'),
    noForm: true,
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'isOut',
    text: _('Enviroment Deployment'),
    options: [
      {
        value: '0',
        label: _('Inside Network Deployment'),
      }, {
        value: '1',
        label: _('Outside Network Deployment'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: _('Enviroment Deployment'),
      placeholder: _('Please Select ') + _('Enviroment'),
    },
  }, {
    id: 'auth_interface',
    text: _('Interface Auth'),
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'isComputer',
    text: _('Computer Auth'),
    options: [
      {
        value: '0',
        label: _('Allowed'),
      }, {
        value: '1',
        label: _('Forbidden'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: _('Computer Auth'),
      placeholder: _('Please Select ') + _('Computer Auth'),
    },
  }, {
    id: 'isdebug',
    text: _('Debug'),
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'lateAuth',
    text: _('Late Auth'),
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
    defaultValue: '0',
    formProps: {
      required: true,
      type: 'select',
      label: _('Late Auth'),
      placeholder: _('Please Select ') + _('Late Auth'),
    },
  }, {
    id: 'lateAuthTime',
    text: _('Late Authtime'),
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
