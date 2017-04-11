import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';

// components
import AppScreen from 'shared/components/Template/AppScreen';

// custom
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  // {
  //   id: 'devicename',
  //   text: __('Name'),
  //   transform(val, item) {
  //     return item.get('devicename') || item.get('mac');
  //   },
  //   validator: validator({
  //     rules: 'utf8Len:[1, 31]',
  //   }),
  //   formProps: {
  //     required: true,
  //   },
  // },
  {
    id: 'mac',
    text: __('MAC'),
    width: '180',
    formProps: {
      required: true,
    },
  },
  {
    id: 'description',
    text: __('Description'),
    formProps: {
      type: 'textarea',
      rows: '4',
    },
  },
]);


const propTypes = {
  changeScreenActionQuery: PropTypes.func,
  onListAction: PropTypes.func,
  createModal: PropTypes.func,
  selectedGroup: PropTypes.object,
};
const defaultProps = {};

// 原生的 react 页面
export default class DubiousClient extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(
      this, [
        'onAction',
        'initListOptions',
      ],
    );
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        listKey="id"
        searchable
        searchProps={{
          placeholder: 'MAC',
        }}
        actionable
      />
    );
  }
}

DubiousClient.propTypes = propTypes;
DubiousClient.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
    groupid: state.product.getIn(['group', 'selected', 'id']),
    selectedGroup: state.product.getIn(['group', 'selected']),
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
)(DubiousClient);

