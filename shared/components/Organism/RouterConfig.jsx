import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router/Switch';
import Route from 'react-router/Route';
import { Redirect } from 'react-router-dom';

export default function renderRoutesTree(routes) {
  if (!routes) {
    return null;
  }

  function renderRoute(route) {
    const key = route.id || route.path;
    const subRoutes = route.routes;
    const RouteComponent = route.component;
    let retComponent = () => null;

    if (subRoutes) {
      if (RouteComponent) {
        retComponent = (
          <Route
            path={route.path}
            key={key}
            children={({ match, ...rest }) => (
              <RouteComponent
                key={key}
                route={route}
                {...rest}
              >
                { match && renderRoutesTree(subRoutes)}
              </RouteComponent>
            )}
          />

        );
      } else {
        retComponent = renderRoutesTree(subRoutes);
      }
    } else if (RouteComponent) {
      retComponent = (
        <Route
          path={route.path}
          render={
            (props) => <RouteComponent {...props} route={route} />
          }
          key={key}
        />
      );
    }

    return retComponent;
  }

  // 单个节点不需要 Switch
  if (routes.length === 1 && routes[0]) {
    return renderRoute(routes[0]);
  }

  return (
    <Switch>
      {
        routes.map(route => renderRoute(route))
      }
    </Switch>
  );
}

export function renderRoutesList(routes) {
  let routeList = null;

  if (!routes) {
    return routeList;
  }

  routeList = [];

  routes.forEach(
    (route) => {
      const retNodes = [];
      const subRoutes = route.routes;
      const curKey = route.id || route.path;
      const indexPath = route.indexPath ||
        (subRoutes && subRoutes[0] && subRoutes[0].path);

      if (indexPath) {
        routeList.push(
          <Route
            key={`${curKey}Redirect`}
            path={route.path}
            render={() => <Redirect to={indexPath} />}
            exact
          />,
        );
      }

      if (route.component) {
        routeList.push(<Route
          key={curKey}
          path={route.path}
          render={
            routeProps => <route.component {...routeProps} route={route} />
          }
        />);

      // 如果无 component 又有子路由
      } else if (subRoutes.length > 0) {
        routeList = routeList.concat(renderRoutesList(subRoutes));
      }

      return retNodes;
    },
  );

  return routeList;
}

export function renderRouteSwitches(props) {
  const { routes } = props;
  const routeList = renderRoutesList(routes);

  return <Switch>{routeList}</Switch>;
}

/**
 * pure Component,只有当路由改变是才重新渲染
 *
 * @export
 * @class RouteSwitches
 * @extends {Component}
 */
const propTypes = {
  routes: PropTypes.array,
};
const defaultProps = {
  routes: [],
};

export class RouteSwitches extends React.Component {
  componentWillMount() {
    this.routeList = renderRoutesList(this.props.routes);
  }

  componentWillReceiveProps(nextProps) {
    const nextRoutes = nextProps.routes;
    const curRoutes = this.props.routes;

    if (nextRoutes !== curRoutes || nextRoutes.length !== curRoutes.length) {
      this.routeList = renderRoutesList(nextProps.routes);
    }
  }

  render() {
    return <Switch>{this.routeList}</Switch>;
  }
}

RouteSwitches.propTypes = propTypes;
RouteSwitches.defaultProps = defaultProps;

