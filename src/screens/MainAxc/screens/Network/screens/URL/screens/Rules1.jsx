import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  Modal, Table, Select, EchartReact, Button, FormGroup,
} from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import Icon from 'shared/components/Icon';


const propTypes = {
  screenStore: PropTypes.instanceOf(Map),
};
const defaultProps = {};

const rulesGroupOptions = fromJS([
  {
    id: 'group_name',
    label: __('Group Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'description',
    label: __('Description'),
    formProps: {
      type: 'textarea',
      required: true,
    },
  },
]);
const filterRulesOptions = fromJS([
  {
    id: 'rule_name',
    label: __('Rule Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'filter_url',
    label: __('Filter URL'),
    help: __('Filter URL[1-100]'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'description',
    label: __('Description'),
    formProps: {
      type: 'textarea',
      required: true,
    },
  },
]);
const bindRulesOptions = fromJS([
  {
    id: 'filterGroup',
    text: __('Group Name'),
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'rule_name',
    text: __('Filter Rules'),
    formProps: {
      multi: true,
      type: 'select',
    },
  },
]);

export default class Rules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBaseShow: true,
      isAdvancedShow: true,
      isStepThreeShow: true,
    };
  }
  toggleBox(moduleName) {
    this.setState({
      [moduleName]: !this.state[moduleName],
    });
  }
  render() {
    const { screenStore } = this.props;
    return (
      <AppScreen
        {...this.props}
        store={screenStore}
      >
        <div className="o-box row">
          <div className="o-box__cell">
            <h3
              style={{ cursor: 'pointer' }}
              onClick={() => this.toggleBox('isBaseShow')}
            >
              <Icon
                name={this.state.isBaseShow ? 'minus-square' : 'plus-square'}
                size="lg"
                style={{
                  marginRight: '5px',
                }}
              />
              {__('Step1: Rules Group')}
            </h3>
          </div>
          {
            this.state.isBaseShow ? (
              <div className="o-box__cell">
                <div className="element t-overview__section">
                  <Table
                    theme="light"
                    options={rulesGroupOptions}
                  />
                </div>
              </div>
            ) : null
          }

          <div className="o-box__cell">
            <h3
              style={{ cursor: 'pointer' }}
              onClick={() => this.toggleBox('isAdvancedShow')}
            >
              <Icon
                name={this.state.isAdvancedShow ? 'minus-square' : 'plus-square'}
                size="lg"
                style={{
                  marginRight: '5px',
                }}
                onClick={() => this.toggleBox('isAdvancedShow')}
              />
              {__('Step2:Filter Rules')}
            </h3>
          </div>
          {
            this.state.isAdvancedShow ? (
              <div className="o-box__cell">
                <div className="element t-overview__section">
                  <Table
                    theme="light"
                    options={filterRulesOptions}
                  />
                </div>
              </div>
            ) : null
          }
          <div className="o-box__cell">
            <h3
              style={{ cursor: 'pointer' }}
              onClick={() => this.toggleBox('isStepThreeShow')}
            >
              <Icon
                name={this.state.isStepThreeShow ? 'minus-square' : 'plus-square'}
                size="lg"
                style={{
                  marginRight: '5px',
                }}
                onClick={() => this.toggleBox('isStepThreeShow')}
              />
              {__('Step3:Bind Rules')}
            </h3>
          </div>
          {
            this.state.isStepThreeShow ? (
              <div className="o-box__cell">
                <div className="element t-overview__section">
                  <Table
                    theme="light"
                    options={bindRulesOptions}
                  />
                </div>
              </div>
            ) : null
          }
        </div>
      </AppScreen>
    );
  }
}

Rules.propTypes = propTypes;
Rules.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    screenStore: state.screens,
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
)(Rules);
