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
    id: 'basName',
    text: _('Bas Name'),
    formProps: {
      required: true,
    },
  }, {
    id: 'basIp',
    text: _('Bas IP'),
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'basPort',
    text: _('Bas Port'),
    formProps: {
      required: true,
    },
  }, {
    id: 'portalVer',
    text: _('Portal Vertion'),
    formProps: {
      required: true,
    },
  }, {
    id: 'authType',
    text: _('Auth Type'),
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
    id: 'basUser',
    text: _('User'),
    formProps: {
      required: true,
      type: 'text',
    },
  }, {
    id: 'basPwd',
    text: _('Password'),
    formProps: {
      required: true,
      type: 'password',
    },
  }, {
    id: 'timeoutSec',
    text: _('Time out'),
    type: 'num',
    formProps: {
      required: true,
    },
  }, {
    id: 'isPortalCheck',
    text: _('Portal Check'),
    formProps: {
      required: true,
    },
  }, {
    id: 'isOut',
    text: _('isOut'),
    formProps: {
      required: true,
    },
  }, {
    id: 'authInterface',
    text: _('Interface Auth'),
    formProps: {
      required: true,
    },
  }, {
    id: 'isComputer',
    text: _('Computer Auth'),
    formProps: {
      required: true,
    },
  }, {
    id: 'web',
    text: _('Web'),
    formProps: {
      required: true,
    },
  }, {
    id: 'isdebug',
    text: _('Debug'),
    formProps: {
      required: true,
    },
  }, {
    id: 'lateAuth',
    text: _('Late Auth'),
    formProps: {
      required: true,
      type: 'checkbox',
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
