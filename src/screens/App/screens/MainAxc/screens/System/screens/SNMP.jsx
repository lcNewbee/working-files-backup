import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppSettings from 'shared/components/Template/AppSettings';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';

const listOptions = fromJS([
  {
    id: 'readPassword',
    label: _('Read Password'),
    formProps: {
      type: 'textarea',
    },
  }, {
    id: 'writePassword',
    label: _('Write Password'),
    formProps: {
      type: 'textarea',
    },
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
    formProps: {
      type: 'switch',
      minWidth: '60px',
    },
  }, {
    id: 'trapServer',
    label: _('Trap Server'),
    formProps: {
      required: true,
      type: 'text',
    },
  }, {
    id: 'trapPassword',
    label: _('Trap Password'),
    formProps: {
      type: 'password',
    },
  },
]);

const formOptions = immutableUtils.getFormOptions(listOptions);
const defaultFormData = immutableUtils.getDefaultData(listOptions);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return (
      <AppSettings
        {...this.props}
        formOptions={formOptions}
        defaultSettingsData={defaultFormData}
        defaultQuery={defaultFormData}
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
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
