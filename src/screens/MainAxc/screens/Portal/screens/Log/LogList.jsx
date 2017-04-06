import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import moment from 'moment';

const queryFormOptions = fromJS([
  {
    id: 'startDate',
    type: 'date',
    label: __('Start Date'),
    isOutsideRange: () => false,
    saveOnChange: true,
  }, {
    id: 'endDate',
    type: 'date',
    label: __('End Date'),
    isOutsideRange: () => false,
    saveOnChange: true,
  },
]);
const defaultQuery = {
  startDate: moment().format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
};
const listOptions = fromJS([
  {
    id: 'info',
    text: __('Log Content'),
    formProps: {
      required: true,
    },
  }, {
    id: 'recDate',
    text: __('Record Date'),
    type: 'text',
    formProps: {
      required: true,
    },
  },
]);
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class OpenPortalBase extends React.Component {
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
        }
      });
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        initOption={{
          query: defaultQuery,
        }}
        queryFormOptions={queryFormOptions}
        listOptions={listOptions}
        actionable
        selectable
        addable={false}
        editable={false}
        searchable
        searchProps={{
          placeholder: `${__('IP')}`,
        }}
      />
    );
  }
}

OpenPortalBase.propTypes = propTypes;
OpenPortalBase.defaultProps = defaultProps;

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
)(OpenPortalBase);
