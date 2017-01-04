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
  }, {
    id: 'basIp',
    text: _('Bas IP'),
  }, {
    id: 'basPort',
    text: _('Bas Port'),
  }, {
    id: 'portalVer',
    text: _('Portal Vertion'),
  }, {
    id: 'authType',
    text: _('Auth Type'),
  }, {
    id: 'sharedSecret',
    text: _('Shared Secret'),
  }, {
    id: 'basUser',
    text: _('User'),
  }, {
    id: 'basPwd',
    text: _('Password'),
  }, {
    id: 'timeoutSec',
    text: _('Time out'),
  }, {
    id: 'isPortalCheck',
    text: _('Portal Check'),
  }, {
    id: 'isOut',
    text: _('isOut'),
  }, {
    id: 'authInterface',
    text: _('Interface Auth'),
  }, {
    id: 'isComputer',
    text: _('Computer Auth'),
  }, {
    id: 'web',
    text: _('Web'),
  }, {
    id: 'isdebug',
    text: _('Debug'),
  }, {
    id: 'lateAuth',
    text: _('Late Auth'),
  }, {
    id: 'lateAuthTime',
    text: _('Late Authtime'),
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
