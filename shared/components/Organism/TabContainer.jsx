import React, { PropTypes } from 'react';
import Tab from 'shared/components/Tab';

const propTypes = {
  route: PropTypes.object,
  children: PropTypes.node,
};
const defaultProps = {};

function TabContainer(props) {
  return (
    <Tab
      menus={props.route.childRoutes}
      role="tab"
    >
      {props.children}
    </Tab>
  );
}

TabContainer.propTypes = propTypes;
TabContainer.defaultProps = defaultProps;

export default TabContainer;
