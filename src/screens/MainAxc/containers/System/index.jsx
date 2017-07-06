import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { NavLink } from 'react-router-dom';
import validator from 'shared/validator';
import {
  Nav, Icon,
} from 'shared/components';
import { RouteSwitches } from 'shared/components/Organism/RouterConfig';
import { actions as appActions } from 'shared/containers/app';
import { actions as propertiesActions } from 'shared/containers/properties';
import * as mainActions from '../../actions';

const validOptions = fromJS({
  groupname: validator({
    rules: 'utf8Len:[1, 31]',
  }),
  remark: validator({
    rules: 'utf8Len:[1, 255]',
  }),
  apmac: validator({
    rules: 'mac',
  }),
  name: validator({
    rules: 'required',
  }),
  model: validator({
    rules: '',
  }),
});

const propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.array,
  }),
  toggleMainNav: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  app: PropTypes.instanceOf(Map).isRequired,
};
const defaultProps = {};

class MainSystem extends React.PureComponent {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'renderBreadcrumb',
    ]);
  }
  renderBreadcrumb() {
    const { app } = this.props;
    const curRoutes = app.getIn(['router', 'routes']).toJS();
    let breadcrumbList = fromJS([]);
    const len = curRoutes.length;
    let i = 2;

    for (i; i < len; i += 1) {
      breadcrumbList = breadcrumbList.unshift({
        path: curRoutes[i].path,
        text: curRoutes[i].text,
      });
    }

    return (
      <ol className="m-breadcrumb m-breadcrumb--simple">
        {
          breadcrumbList.map(item => (
            <li key={item.path}>
              <NavLink
                className="m-breadcrumb__link"
                to={item.path}
              >
                {item.text}
              </NavLink>
            </li>
          ))
        }
      </ol>
    );
  }
  render() {
    const { route } = this.props;
    return (
      <div>
        <div className="o-menu-bar">
          {
            this.renderBreadcrumb()
          }
        </div>
        <div className="t-main__nav">
          <Nav
            role="tree"
            menus={route.routes}
            location={this.props.location}
            onChange={this.onClickNav}
            isTree
          />
        </div>
        <div className="t-main__nav-toggle" onClick={this.props.toggleMainNav} >
          <Icon name="caret-left" />
        </div>
        <div className="t-main__content">
          <RouteSwitches
            routes={route.routes}
          />
        </div>
      </div>
    );
  }
}

MainSystem.propTypes = propTypes;
MainSystem.defaultProps = defaultProps;

export default MainSystem;

function mapStateToProps(state) {
  return {
    app: state.app,
    product: state.product,
    properties: state.properties,
    vlanid: state.product.getIn(['vlan', 'selected', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    propertiesActions,
    mainActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(MainSystem);
