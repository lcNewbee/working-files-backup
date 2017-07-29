import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initScreen: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateCurListItem: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  isVirtualInterfaceEnable() {
    const curScreenId = this.props.store.get('curScreenId');
    const enable = this.props.props.store.getIn([curScreenId, ])
  }

  render() {
    const listOptions = fromJS([
      {
        id: 'vlanId',
        text: __('VLAN ID'),
        formProps: {
          type: 'number',
        },
      },
      {
        id: 'interfaceEnable',
        text: __('Virtual Interface'),
        options: [
          { label: __('ON'), value: '1' },
          { label: __('OFF'), value: '0' },
        ],
        formProps: {
          type: 'checkbox',
        },
      },
      {
        id: 'status',
        text: __('Status'),
        options: [
          { label: __('ON'), value: '1' },
          { label: __('OFF'), value: '0' },
        ],
        formProps: {
          type: 'switch',
          minWidth: '100px',
          visible(data) {
            const enable = data.get('interfaceEnable');
            return enable === '1';
          },
        },
      },
      {
        id: 'ip',
        text: __('IP'),
        formProps: {
          type: 'text',
          visible(data) {
            const enable = data.get('interfaceEnable');
            return enable === '1';
          },
        },
      },
      {
        id: 'mask',
        text: __('Mask'),
        formProps: {
          type: 'text',
          visible(data) {
            const enable = data.get('interfaceEnable');
            return enable === '1';
          },
        },
      },
      {
        id: 'arpEnable',
        text: __('ARP Agent'),
        options: [
          { label: __('ON'), value: '1' },
          { label: __('OFF'), value: '0' },
        ],
        formProps: {
          type: 'switch',
          minWidth: '100px',
          visible(data) {
            const enable = data.get('interfaceEnable');
            return enable === '1';
          },
        },
      },
      {
        id: 'description',
        text: __('Description'),
        formProps: {
          type: 'textarea',
        },
      },
    ]);
    const editFormOptions = immutableUtils.getFormOptions(listOptions);
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        editFormOptions={editFormOptions}
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
