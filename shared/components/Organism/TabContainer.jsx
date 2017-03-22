import React, { PropTypes } from 'react';
import Tab from 'shared/components/Tab';
import { renderRoutesSwitch } from 'shared/components/Organism/RouterConfig';

const propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.array,
  }),
  children: PropTypes.node,
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
        {renderRoutesSwitch(route.routes)}
        {this.props.children}
      </Tab>
    );
  }
}


TabContainer.propTypes = propTypes;
TabContainer.defaultProps = defaultProps;

export default TabContainer;
