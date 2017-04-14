import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'mac',
    text: __('Mac Address'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'mac',
      }),
    },
  },
]);

const propTypes = {
  params: PropTypes.object,
};
const defaultProps = {};

export default class View extends React.Component {
  render() {
    // {loginName:"1"}
    const { loginName } = this.props.params;

    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        editable={false}
        initOption={{
          query: {
            loginName,
          },
          actionQuery: {
            loginName,
          },
        }}
        noTitle
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
