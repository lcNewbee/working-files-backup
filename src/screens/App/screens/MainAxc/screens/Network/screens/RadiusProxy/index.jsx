// npm
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

// custom
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

const formOptions = fromJS([
  {
    id: 'radsec_enable',
    label: _('Enable'),
    type: 'checkbox',
    required: true,
  }, {
    id: 'radius_template',
    label: _('Radius Server'),
    type: 'select',
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
    apList: state.product.get('devices'),
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
