import React from 'react';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const formOptions = fromJS([
  {
    id: 'readPassword',
    label: _('Read Password'),
    type: 'textarea',
  }, {
    id: 'writePassword',
    label: _('Write Password'),
    type: 'textarea',
  }, {
    id: 'version',
    label: _('Version'),
    defaultValue: 'V1',
    options: [
      {
        value: 'V1',
        label: 'V1',
      }, {
        value: 'V2C',
        label: 'V2C',
      }, {
        value: 'V3',
        label: 'V3',
      },
    ],
    type: 'switch',
    minWidth: '60px',
  }, {
    id: 'trapServer',
    label: _('Trap Server'),
    required: true,
    type: 'text',
  }, {
    id: 'trapPassword',
    label: _('Trap Password'),
    type: 'password',
  },
]);

const propTypes = {};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={formOptions}
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
