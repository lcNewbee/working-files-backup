import React from 'react';
import Switch from 'react-router/Switch';
import Route from 'react-router/Route';
import { Redirect } from 'react-router-dom';

let prevRouteList = null;
let prevRoutes = null;

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
                { match && renderRoutesTree(routeRoutes)}
              </RouteComponent>
            )}
          />

        );
      } else {
        retComponent = renderRoutesTree(routeRoutes);
      }
    } else if (RouteComponent) {
      retComponent = (
        <Route

          path={route.path}
          render={
            (props) => {
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

  // 缓存执行结果
  if (routes !== prevRoutes) {
    routeList = [];

    routes.forEach(
      (route) => {
        const retNodes = [];
        const sunRoutes = route.routes;
        const curKey = route.id || route.path;
        const indexPath = route.indexPath ||
          (sunRoutes && sunRoutes[0] && sunRoutes[0].path);

        if (indexPath) {
          routeList.push(
            <Route
              key={`${curKey}Redirect`}
              path={route.path}
              render={() => (
                <Redirect to={indexPath} />
              )}
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
        } else if (sunRoutes.length > 0) {
          routeList = routeList.concat(renderRoutesList(sunRoutes));
        }

        return retNodes;
      },
    );

    prevRoutes = routes;
    prevRouteList = routeList;

  // 如果参数没变返回上次结果
  } else {
    routeList = prevRouteList;
  }

  return routeList;
}

export function RouteSwitchs(props) {
  const { routes } = props;
  const routeList = renderRoutesList(routes);

  return <Switch>{routeList}</Switch>;
}



