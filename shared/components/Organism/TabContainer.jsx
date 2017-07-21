import React from 'react';
import PropTypes from 'prop-types';
import Tab from '../Tab';
import { RouteSwitches } from './RouterConfig';

const propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.array,
  }),
  children: PropTypes.node,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};
const defaultProps = {};

class TabContainer extends React.PureComponent {
  render() {
    const { route, match, location } = this.props;

    if (match.url === location.pathname) {
      return null;
    }

    return (
      <Tab
        menus={route.routes}
        role="tab"
      >
        <RouteSwitches
          routes={route.routes}
        />
        {this.props.children}
      </Tab>
    );
  }
}


TabContainer.propTypes = propTypes;
TabContainer.defaultProps = defaultProps;

export default TabContainer;
