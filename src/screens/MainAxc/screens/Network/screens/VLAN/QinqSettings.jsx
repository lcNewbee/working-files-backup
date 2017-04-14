import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  AppScreen,
} from 'shared/components';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const qinqOptions = [
  { label: __('Turn Off'), value: '0' },
  { label: __('Based On VLAN'), value: '1' },
  { label: __('Based On AP'), value: '2' },
];
// const tableOptions = immutableUtils.getTableOptions(listOptions);
// const editFormOptions = immutableUtils.getFormOptions(listOptions);
// const defaultEditData = immutableUtils.getFormOptions(listOptions);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initScreen: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};

const settingsFormOptions = fromJS([
  {
    id: 'qinqMode',
    label: __('QINQ Mode'),
    type: 'select',
    options: qinqOptions,
  },
]);

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsFormOptions}
        hasSettingsSaveButton
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
