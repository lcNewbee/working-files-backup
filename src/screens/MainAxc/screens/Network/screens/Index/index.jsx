import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { fromJS, Map } from 'immutable';
import validator from 'shared/validator';
import {
  createContainer,
  AppScreen,
} from 'shared/containers/appScreen';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
};
const defaultProps = {};

export default class NetworkIndex extends React.Component {

  render() {
    return (
      <div> this is a test page </div>
    );
  }
}

NetworkIndex.propTypes = propTypes;
NetworkIndex.defaultProps = defaultProps;

export const Screen = createContainer(NetworkIndex);
