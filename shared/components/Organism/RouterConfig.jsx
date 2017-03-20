import React from 'react';
import Switch from 'react-router/Switch';
import Route from 'react-router/Route';

export default function renderRoutesConfig(routes) {
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
              console.log(route);
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
