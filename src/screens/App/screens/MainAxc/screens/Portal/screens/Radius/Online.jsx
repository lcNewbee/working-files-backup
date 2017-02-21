import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const onlinetimeFilter = utils.filter('connectTime');

const listOptions = fromJS([
  {
    id: 'nasip',
    text: _('NAS IP'),
  }, {
    id: 'ip',
    text: _('Source IP'),
  }, {
    id: 'userip',
    text: _('User IP'),
  }, {
    id: 'callingstationid',
    text: _('Mac'),
  }, {
    id: 'name',
    text: _('Name'),
  }, {
    id: 'sessionTime',
    text: _('Session Time'),
  }, {
    id: 'octets',
    text: _('Available Traffic'),
  }, {
    id: 'clientType',
    text: _('Time out'),
  }, {
    id: 'startDate',
    text: _('Online Date'),
  }, {
    id: 'costTime',
    text: _('Online Time'),
    transform(val) {
      return onlinetimeFilter.transform(val / 1000);
    },
  }, {
    id: 'inS',
    text: _('Up Traffic'),
  }, {
    id: 'outS',
    text: _('Down Traffic'),
  }, {
    id: 'costOctets',
    text: _('Used Traffic'),
  }, {
    id: 'updateDate',
    text: _('Update Date'),
  }, {
    id: 'acctSessionId',
    text: _('Acc ID'),
  }, {
    id: 'state',
    text: _('Acc Type'),
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
