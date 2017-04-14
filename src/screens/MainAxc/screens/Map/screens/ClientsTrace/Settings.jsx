import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';

import validator from 'shared/validator';
// custom
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';

const formOptions = fromJS([
  {
    id: 'enable',
    label: __('Enable'),
    type: 'checkbox',
    required: true,
  }, {
    id: 'reporttime',
    label: __('Data Report Time'),
    type: 'number',
    help: __('Minutes'),
    min: 1,
    defaultValue: 10,
    max: 65535,
    required: true,
  },
]);

const propTypes = {
  fetch: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'getTemplateList',
    ]);
    this.state = {
      templateListLoaded: false,
    };
    this.formOptions = formOptions;
  }


  componentWillMount() {
    this.getTemplateList();
  }


  getTemplateList() {
    return this.props.fetch('goform/network/radius/template')
      .then((json) => {
        if (json && json.state && json.state.code === 2000) {
          if (json && json.data && json.data.list) {
            this.templateListOptions = json.data.list.map(
              item => ({
                value: item.template_name,
                label: item.template_name,
              }),
            );
            this.formOptions = this.formOptions.setIn([-1, 'options'], this.templateListOptions);
            this.setState({
              templateListLoaded: true,
            });
          }
        }
      });
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={this.formOptions}
        actionable
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
    groupid: state.product.getIn(['group', 'selected', 'id']),
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
    propertiesActions,
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
