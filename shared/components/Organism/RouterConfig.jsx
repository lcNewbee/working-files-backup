import React from 'react';
import Switch from 'react-router/Switch';
import Route from 'react-router/Route';
import { Redirect } from 'react-router-dom';

export default function renderRoutesTree(routes) {
  if (!routes) {
    return null;
  }

  function renderRoute(route) {
    const key = route.id || route.path;
    const routeRoutes = route.routes;
    const RouteComponent = route.component;
    let retComponent = () => null;

    if (routeRoutes) {
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
                { match && renderRoutesConfig(routeRoutes)}
              </RouteComponent>
            )}
          />

        );
      } else {
        retComponent = renderRoutesConfig(routeRoutes);
      }
    } else if (RouteComponent) {
      retComponent = (
        <Route
          path={route.path}
          render={
            (props) => {
              console.log('cur Route', route);
              return <RouteComponent {...props} route={route} />;
            }
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

      if (route.component) {
        routeList.push(<Route
          path={route.path}
          render={
            routeProps => <route.component {...routeProps} route={route} />
          }
        />);
      }

      return retNodes;
    },
  );

  return routeList;
}

export function renderRoutesSwitch(routes) {
  return <Switch>{renderRoutesList(routes)}</Switch>;
}

