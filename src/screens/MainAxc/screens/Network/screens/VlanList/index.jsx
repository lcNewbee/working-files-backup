import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import { FormGroup, FormInput } from 'shared/components';
import {
  actions as screenActions, AppScreen, createContainer,
} from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

// import RangeInput from 'shared/components/Form/RangeInput';

import './index.scss';

const validOptions = Map({
  validNumRange: validator({
    rules: 'numberRange:[1,4094]',
  }),
});

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  editListItemByIndex: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateCurListItem: PropTypes.func,
  validateOption: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.changeScreenActionQuery({ addMethod: 'single' });
  }

  componentWillReceiveProps(nextProps) {
    const curScreenId = this.props.store.get('curScreenId');
    const curAction = this.props.store.getIn([curScreenId, 'actionQuery', 'action']);
    const nextAction = nextProps.store.getIn([curScreenId, 'actionQuery', 'action']);
    if (curAction !== nextAction) {
      this.props.changeScreenActionQuery({ addMethod: 'single' });
    }
  }

  render() {
    const curScreenId = this.props.store.get('curScreenId');
    // const actionQuery = this.props.store.getIn([curScreenId, 'actionQuery']);
    const listOptions = fromJS([
      {
        id: 'addMethod',
        noTable: true,
        noForm: this.props.store.getIn([curScreenId, 'actionQuery', 'action']) === 'edit',
        formProps: {
          render: () => (
            <FormGroup
              type="switch"
              label={__('Add Method')}
              width="100"
              options={[
                { label: __('Single VLAN'), value: 'single' },
                { label: __('VLAN Group'), value: 'group' },
              ]}
              value={this.props.store.getIn([curScreenId, 'actionQuery', 'addMethod'])}
              onChange={(data) => {
                this.props.changeScreenActionQuery({ addMethod: data.value });
              }}
            />
          ),
        },
      },
      // single VLAN
      {
        id: 'vlanId',
        text: __('VLAN ID'),
        noForm: this.props.store.getIn([curScreenId, 'actionQuery', 'addMethod']) !== 'single',
        formProps: {
          required: true,
          type: 'number',
          disabled: this.props.store.getIn([curScreenId, 'actionQuery', 'action']) === 'edit',
        },
      },
      {
        id: 'vlanName',
        noForm: this.props.store.getIn([curScreenId, 'actionQuery', 'addMethod']) !== 'single',
        text: __('Name'),
      },
      {
        id: 'status',
        noForm: true,
        text: __('Status'),
      },
      {
        id: 'description',
        noForm: this.props.store.getIn([curScreenId, 'actionQuery', 'addMethod']) !== 'single',
        text: __('Description'),
        render: (val) => {
          if (!val) return '--';
          return val;
        },
        formProps: {
          type: 'textarea',
        },
      },
      // VLAN group
      {
        id: 'vlanRange',
        noForm: this.props.store.getIn([curScreenId, 'actionQuery', 'addMethod']) !== 'group',
        formProps: {
          render: () => (
            <FormGroup
              type="number-range"
              label={__('VLAN Range')}
              style={{ width: '470px' }}
              min={1}
              max={4094}
              required
              value={typeof this.props.store.getIn([curScreenId, 'actionQuery', 'vlanRange']) === 'undefined' ?
                '-' : this.props.store.getIn([curScreenId, 'actionQuery', 'vlanRange'])}
              onLowerInputChange={(data) => {
                const actionQuery = this.props.store.getIn([curScreenId, 'actionQuery']);
                let vlanRange = actionQuery.get('vlanRange') || '-';
                const vlanRangeArr = vlanRange.split('-');
                vlanRangeArr[0] = data.value;
                vlanRange = vlanRangeArr.join('-');
                this.props.changeScreenActionQuery({ vlanRange });
              }}
              onUpperInputChange={(data) => {
                const actionQuery = this.props.store.getIn([curScreenId, 'actionQuery']);
                let vlanRange = actionQuery.get('vlanRange') || '-';
                const vlanRangeArr = vlanRange.split('-');
                vlanRangeArr[1] = data.value;
                vlanRange = vlanRangeArr.join('-');
                this.props.changeScreenActionQuery({ vlanRange });
              }}
              help={`${__('Range: ')}1 - 4094`}
              {...this.props.validateOption.validNumRange}
            />
          ),
        },
      },
    ]);
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
  validator.mergeProps(validOptions),
)(View);

