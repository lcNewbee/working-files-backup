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
    id: 'ip',
    text: _('IP'),
  }, {
    id: 'name',
    text: _('Name'),
  }, {
    id: 'description',
    text: _('Description'),
  }, {
    id: 'type',
    text: _('Type'),
  }, {
    id: 'sharedSecret',
    text: _('Shared Secret'),
  }, {
    id: 'ex1',
    text: _('Ex1'),
  }, {
    id: 'ex2',
    text: _('Password'),
  }, {
    id: 'ex3',
    text: _('Time out'),
  }, {
    id: 'ex3',
    text: _('Portal Check'),
  }, {
    id: 'ex4',
    text: _('isOut'),
  }, {
    id: 'ex5',
    text: _('Interface Auth'),
  }, {
    id: 'ex6',
    text: _('Computer Auth'),
  }, {
    id: 'ex7',
    text: _('Web'),
  }, {
    id: 'ex8',
    text: _('Debug'),
  }, {
    id: 'ex9',
    text: _('Late Auth'),
  }, {
    id: 'ex10',
    text: _('Late Auth'),
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
