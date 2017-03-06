import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormContainer,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const qinqOptions = [
  { label: _('Turn Off'), value: '0' },
  { label: _('Based On VLAN'), value: '1' },
  { label: _('Based On AP'), value: '2' },
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

const formOptions = fromJS([
])

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <FormContainer
        hasSaveButton
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
