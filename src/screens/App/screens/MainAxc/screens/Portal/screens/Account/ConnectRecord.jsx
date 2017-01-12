import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'userName',
    text: _('User Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
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
    id: 'basip',
    text: _('Bas IP'),
    formProps: {
      type: 'text',
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
      validator: validator({
        rules: 'mac',
      }),
    },
  }, {
    id: 'onlinedate',
    text: _('Online Date'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'offlinedate',
    text: _('Offline Date'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'onlinetime',
    text: _('Online Time'),
    type: 'num',
    formProps: {
      required: true,
    },
  }, {
    id: 'accType',
    text: _('Acc Type'),
    formProps: {
      required: true,
    },
  }, {
    id: 'downtraffic',
    text: _('Down Traffic'),
    formProps: {
      required: true,
    },
  }, {
    id: 'upTraffic',
    text: _('Up Traffic'),
    formProps: {
      required: true,
    },
  }, {
    id: 'accLogic',
    text: _('Acc Logic'),
    formProps: {
      required: true,
    },
  }, {
    id: 'reason',
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
