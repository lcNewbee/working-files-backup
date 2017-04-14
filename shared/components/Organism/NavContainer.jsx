import React from 'react';
import PropTypes from 'prop-types';
import Nav from 'shared/components/Nav';
import { RouteSwitchs } from 'shared/components/Organism/RouterConfig';

const propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.array,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};
const defaultProps = {};

class NavContainer extends React.PureComponent {
  render() {
    const { route } = this.props;
    return (
      <div>
        <div className="t-main__nav">
          <Nav
            role="tree"
            menus={route.routes}
            location={this.props.location}
            onChange={this.onClickNav}
            isTree
          />
        </div>

        <div className="t-main__content">
          <RouteSwitchs
            routes={route.routes}
          />
        </div>
      </div>
    );
  }
}

NavContainer.propTypes = propTypes;
NavContainer.defaultProps = defaultProps;

export default NavContainer;
