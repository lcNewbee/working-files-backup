import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { actions as appActions } from '../app';
import * as myActions from './actions';
import myReducer from './reducer';
import myComponents from './components';

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    myActions,
  ), dispatch);
}

// Export List
export function createContainer(component) {
  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(component);
}

export const AppContainer = createContainer(myComponents.AppScreen);
export const actions = myActions;
export const reducer = myReducer;
export const components = myComponents;

export { default as AppScreen } from './components/AppScreen';
export { default as AppScreenList } from './components/AppScreenList';
export { default as AppScreenSettings } from './components/AppScreenSettings';


