import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'img',
    text: _('Adv Pitcture'),
    formProps: {
      type: 'file',
      required: true,
    },
  },
  {
    id: 'name',
    text: _('Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  },
  {
    id: 'uid',
    text: _('Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  },
  {
    id: 'sid',
    text: _('Store Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  },
  {
    id: 'showCount',
    text: _('Show Count'),
    formProps: {
      type: 'number',
      required: true,
    },
  },
  {
    id: 'clickCount',
    text: _('Click Count'),
    formProps: {
      type: 'number',
      required: true,
    },
  },
  {
    id: 'pos',
    text: _('Sorting'),
    formProps: {
      type: 'text',
      required: true,
    },
  },
]);

const propTypes = {};
const defaultProps = {};

export default class AdvStores extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        editFormOption={{
          hasFile: true,
        }}
        actionable
        selectable
      />
    );
  }
}

AdvStores.propTypes = propTypes;
AdvStores.defaultProps = defaultProps;

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
)(AdvStores);
