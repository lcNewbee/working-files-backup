import React, { Component, PropTypes } from 'react';
// import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';
import { fromJS } from 'immutable';
import Icon from '../Icon';

const propTypes = {
  menus: PropTypes.array.isRequired,
  className: PropTypes.string,
  location: PropTypes.object,
  role: PropTypes.oneOf(['nav', 'tab']),

  // 是否渲染多级菜单
  isTree: PropTypes.bool,
};

const defaultProps = {
  menus: [],
  isTree: false,
};

/**
 * DSAD
 * DSD
 * @param {any} props
 * @returns
 */
function NavLink(props) {
  const { item, className } = props;
  const { icon, path, text } = item.toJS();

  return (
    <Link
      to={path}
      className={className}
      activeClassName="active"
    >
      {
        icon ? <Icon name={icon} /> : null
      }
      {text}
    </Link>
  );
}
NavLink.propTypes = {
  item: PropTypes.object.isRequired,
  className: PropTypes.string,
};


class Nav extends Component {
  constructor(props) {
    super(props);

    // this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
  }
  onSelectItem() {

  }
  render() {
    const { className, menus, location, isTree, role } = this.props;
    let navClassName = className;
    let linkClassName = 'm-menu__link';

    if (role === 'nav') {
      linkClassName = `${linkClassName} o-nav__link`;
      navClassName = `${navClassName} o-nav`;
    } else if (role === 'nav') {
      navClassName = `${navClassName} o-tab__nav`;
    }
    return (
      <nav className={navClassName}>
        <ul className="m-menu m-menu--open">
          {
            fromJS(menus).map((item, i) => {
              const myKey = `nav${i}`;
              const hasSubmenus = isTree && item.get('childRoutes');
              let subMenuClassName = 'o-nav__sub-menus m-menu';
              let isActive = false;

              if (location && location.pathname) {
                isActive = location.pathname.indexOf(`${item.get('path')}/`) === 0
                  || location.pathname === item.get('path');
              }

              if (isActive) {
                subMenuClassName = `${subMenuClassName} m-menu--open`;
              }

              return (
                <li key={myKey}>
                  <NavLink
                    item={item}
                    className={linkClassName}
                  />
                  {
                    hasSubmenus ? (
                      <ul className={subMenuClassName}>
                        {
                          item.get('childRoutes').map((subItem, n) => {
                            const thisKey = `${myKey}.${n}`;
                            return (
                              <li key={thisKey}>
                                <NavLink
                                  item={subItem}
                                  className={linkClassName}
                                />
                              </li>
                            );
                          })
                        }
                      </ul>
                    ) : null
                  }
                </li>
              );
            })
          }
        </ul>
      </nav>
    );
  }
}

Nav.propTypes = propTypes;
Nav.defaultProps = defaultProps;

export default Nav;

