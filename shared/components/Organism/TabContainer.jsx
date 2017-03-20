import React, { PropTypes } from 'react';
import Tab from 'shared/components/Tab';
import { renderRoutes } from 'react-router-config';

const propTypes = {
  route: PropTypes.object,
  children: PropTypes.node,
};
const defaultProps = {};

function TabContainer(props) {
  console.log('tab = ', props.route.routes)
  return (
    <Tab
      menus={props.route.routes}
      role="tab"
    >
      {props.children}
    </Tab>
  );
}

TabContainer.propTypes = propTypes;
TabContainer.defaultProps = defaultProps;

export default TabContainer;
