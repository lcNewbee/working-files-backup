import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

const remoteActionMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

export default remoteActionMiddleware;
