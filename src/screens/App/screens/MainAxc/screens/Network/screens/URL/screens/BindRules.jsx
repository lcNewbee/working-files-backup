import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

function getFilterGroup() {
  return utils.fetch('goform/network/url/rulesgroup')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.group_name,
            label: `${item.group_name}`,
          }),
        ),
      }
    ),
  );
}

function getFilterRules() {
  return utils.fetch('goform/network/url/filterrules')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.rule_name,
            label: `${item.rule_name}`,
          }),
        ),
      }
    ),
  );
}


const listOptions = fromJS([
  {
    id: 'filterGroup',
    text: _('Group Name'),
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'rule_name',
    text: _('Filter Rules'),
    formProps: {
      multi: true,
      type: 'select',
    },
  },
]);

const propTypes = {
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterGroupOptions: fromJS([]),
      filterRulesOptions: fromJS([]),
    };
  }
  componentWillMount() {
    getFilterGroup()
      .then(
        (data) => {
          this.setState({
            filterGroupOptions: fromJS(data.options),
          });
        },
      );
    getFilterRules()
      .then(
        (data) => {
          this.setState({
            filterRulesOptions: fromJS(data.options),
          });
        },
      );
  }

  render() {
    const newListOptions = listOptions
      .setIn([0, 'options'], this.state.filterGroupOptions)
      .setIn([1, 'options'], this.state.filterRulesOptions);
    return (
      <AppScreen
        {...this.props}
        listOptions={newListOptions}
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
