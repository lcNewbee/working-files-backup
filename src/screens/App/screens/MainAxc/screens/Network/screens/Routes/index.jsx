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
    id: 'destnet',
    text: _('Target IP'),
    defaultValue: '',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip:[true]',
        exclude: '0.0.0.0',
      }),
    },
  }, {
    id: 'mask',
    text: _('Target Subnet Mask'),
    defaultValue: '',
    formProps: {
      required: true,
      validator: validator({
        rules: 'mask',
        exclude: ['0.0.0.0', '255.255.255.255'],
      }),
    },
  }, {
    id: 'gateway',
    text: _('Next Hop IP'),
    defaultValue: '',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  },
]);

const propTypes = {
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        listKey="allKeys"
        actionable
        selectable
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

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
)(View);
