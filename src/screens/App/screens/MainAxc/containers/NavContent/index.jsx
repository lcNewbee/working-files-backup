import React, { PropTypes } from 'react';
import Nav from 'shared/components/Nav';
import { renderRoutesList } from 'shared/components/Organism/RouterConfig';

const propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.array,
  }),
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }),
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};
const defaultProps = {};

class Network extends React.PureComponent {
  componentDidMount() {
    const { location, history, match, route } = this.props;

    if (match.url === location.pathname) {
      history.replace(route.routes[0].path);
    }
  }

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
          {renderRoutesList(route.routes)}
        </div>
      </div>
    );
  }
}

Network.propTypes = propTypes;
Network.defaultProps = defaultProps;

export default Network;
