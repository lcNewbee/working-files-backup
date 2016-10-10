import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import {
  ListInfo,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const screenOptions = fromJS([
  {
    id: 'time',
    text: _('Time'),
  }, {
    id: 'operator',
    text: _('Operator'),
    defaultQuery: '',
    formProps: {
      display: 'inline',
    },
  }, {
    id: 'type',
    text: _('Operation Type'),
  }, {
    id: 'operationCommand',
    text: _('Operation Command'),
  }, {
    id: 'operationResult',
    text: _('Operation Result'),
  },
]);
const tableOptions = immutableUtils.getTableOptions(screenOptions);
const queryFormOptions = immutableUtils.getQueryFormOptions(screenOptions);
const defaultQueryData = immutableUtils.getDefaultData(screenOptions, 'defaultQuery');
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

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log(json);
        }
      });
  }

  render() {
    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        queryFormOptions={queryFormOptions}
        defaultQueryData={defaultQueryData}
        editable={false}
        addable={false}
        actionable
        noTitle
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
    screenActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
