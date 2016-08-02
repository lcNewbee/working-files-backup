import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import * as actions from './actions';
import * as appActions from 'shared/actions/app';
import myReducer from './reducer';

export default class View extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  };
  render() {
    return (
      <div>
        <h3 className="t-main__content-title">{_('NAT Settings')}</h3>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    interfaces: state.interfaces,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);

export const reducer = myReducer;
