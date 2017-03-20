import React, { PropTypes } from 'react';
import Tab from 'shared/components/Tab';

const propTypes = {
  route: PropTypes.object,
  children: PropTypes.node,
};
const defaultProps = {};

function TabView(props) {
  return (
    <Tab
      menus={props.route.routes}
      role="tab"
    >
      {props.children}
    </Tab>
  );
}

TabView.propTypes = propTypes;
TabView.defaultProps = defaultProps;

export default TabView;
