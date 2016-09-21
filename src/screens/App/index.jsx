import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'shared/actions/app';
import { Modal } from 'shared/components';

const propTypes = {
  closeModal: PropTypes.func,
  fetchProductInfo: PropTypes.func,
  app: PropTypes.object,
  children: PropTypes.node,
};

const defaultProps = {
  closeModal: () => true,
};

class App extends Component {
  constructor(props) {
    super(props);

    this.onModalClose = this.onModalClose.bind(this);
    this.onModalApply = this.onModalApply.bind(this);
  }
  componentWillMount() {
    if (this.props.fetchProductInfo) {
      this.props.fetchProductInfo();
    }
  }

  onModalClose() {
    this.props.closeModal({
      status: 'cancel',
    });
  }

  onModalApply() {
    this.props.closeModal({
      status: 'ok',
    });
  }

  render() {
    const { modal } = this.props.app.toJS();

    return (
      <div>
        { this.props.children }
        <Modal
          isShow={modal.status === 'show'}
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
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}
// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions
)(App);

export { default as app } from './reducer';
