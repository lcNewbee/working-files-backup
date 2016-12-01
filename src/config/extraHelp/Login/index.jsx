import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from 'shared/utils';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from 'shared/actions/app';
import Button from 'shared/components/Button/Button';
import FormGroup from 'shared/components/Form/FormGroup';
import * as actions from './actions';
import reducer from './reducer';


const propTypes = {
  changeEnable: PropTypes.func,
  changeDirection: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  fetch: PropTypes.func,
  save: PropTypes.func,
};

const defaultProps = {
  closeModal: () => true,
};

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    utils.binds(this, [
    ]);
  }
  componentWillMount() {
    this.props.fetch('goform/get_direction').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.changeEnable(json.data.enable);
        this.props.changeDirection(json.data.direction);
      }
    });
  }


  render() {
    return (
      <div>
        <div className="sign">
          <div className="sign-backdrop" />
          <div className="sign-content">
            <FormGroup
              type="checkbox"
              label={_('Direction Switch')}
              checked={this.props.selfState.get('enable') === '1'}
              onChange={() => {
                const val = this.props.selfState.get('enable') === '1' ? '0' : '1';
                this.props.changeEnable(val);
              }}
            />
            <FormGroup
              type="select"
              label={_('Direction Select')}
              value={this.props.selfState.get('direction')}
              disabled={this.props.selfState.get('enable') === '0'}
              options={[
                { value: '1', label: 'Direction 1' },
                { value: '2', label: 'Direction 2' },
                { value: '3', label: 'Direction 3' },
                { value: '4', label: 'Direction 4' },
                { value: '5', label: 'Direction 5' },
                { value: '6', label: 'Direction 6' },
                { value: '7', label: 'Direction 7' },
                { value: '8', label: 'Direction 8' },
              ]}
              onChange={(data) => {
                this.props.changeDirection(data.value);
              }}
            />
            <Button
              text="Save"
              onClick={() => {
                const query = {
                  enable: this.props.selfState.get('enable'),
                  direction: this.props.selfState.get('direction'),
                };
                this.props.save('goform/set_direction', query);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
Login.propTypes = propTypes;
Login.defaultProps = defaultProps;

function mapStateToProps(state) {
  const myState = state.login;

  return {
    selfState: myState,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export const login = reducer;

