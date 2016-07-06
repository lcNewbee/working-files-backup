import React from 'react';
import utils from 'utils';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as actions from 'actions/app';
import reducer from './reducer';
import Modal from 'components/Modal';

export const App = React.createClass({

  componentWillMount() {
    this.props.fetchAcInfo();
  },

  onModalClose() {
    this.props.closeModal({
      status: 'cancel'
    });
  },

  onModalApply() {
    this.props.closeModal({
      status: 'ok'
    });
  },

  render: function() {
    const { modal } = this.props.app.toJS();

    return (
      <div>
        { this.props.children }
        <Modal
          isShow={modal.status === 'show' ? true : false}
          title={modal.title}
          role={modal.role}
          transitionEnter={false}
          transitionLeave={false}
          onClose={this.onModalClose}
          onOk={this.onModalApply}
        >
          {modal.text}
        </Modal>
      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.app;

  return {
    app: myState
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    actions
  ), dispatch)
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export const app = reducer;
