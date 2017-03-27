import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions } from 'shared/containers/appScreen';

const formOptions = fromJS([
  {
    id: 'ip',
    label: __('IP Address'),
    type: 'text',
  }, {
    id: 'version',
    label: __('Version'),
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
    id: 'trapPassword',
    label: __('Community Name'),
    type: 'text',
  }, {
    id: 'readPassword',
    label: __('Read Password'),
    type: 'textarea',
  }, {
    id: 'writePassword',
    label: __('Write Password'),
    type: 'textarea',
  }, {
    id: 'trapServer',
    label: __('Trap Server'),
    required: true,
    type: 'text',
  }, {
    id: 'trapPassword',
    label: __('Trap Password'),
    required: true,
    type: 'password',
  },
]);

const propTypes = {};
const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);
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
