import React, { PropTypes } from 'react';
import Tab from 'shared/components/Tab';
import { renderRoutesList } from 'shared/components/Organism/RouterConfig';

const propTypes = {
  route: PropTypes.object,
  children: PropTypes.node,
};
const defaultProps = {};

function TabContainer(props) {
  return (
    <Tab
      menus={props.route.routes}
      role="tab"
    >
      {renderRoutesList(props.route.routes)}
    </Tab>
  );
}

TabContainer.propTypes = propTypes;
TabContainer.defaultProps = defaultProps;

export default TabContainer;
