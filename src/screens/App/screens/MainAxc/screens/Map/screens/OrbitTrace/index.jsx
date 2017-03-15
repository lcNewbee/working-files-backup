import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import Button from 'shared/components/Button/Button';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';
import * as axcActions from '../../../../actions';
import '../../shared/_map.scss';

const propTypes = {

};

const defaultProps = {};

const queryFormOptions = fromJS([
  {
    id: 'time',
    label: _('Time'),
    type: 'select',
    inputStyle: {
      minWidth: '160px',
    },
    searchable: true,
    saveOnChange: true,
    options: [],
  },
]);

export default class View extends React.PureComponent {
  render() {
    const actionBarChildren = [

    ];
    return (
      <AppScreen
        {...this.props}
        actionable={false}
        queryFormOptions={queryFormOptions}
      >
        <div className="m-action-bar">
          {
            actionBarChildren
          }
        </div>
        <div className="o-map-warp">
          <h2>23423</h2>
        </div>
      </AppScreen>
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
    propertiesActions,
    axcActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
