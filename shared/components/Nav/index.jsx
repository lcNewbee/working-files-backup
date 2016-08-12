import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { fromJS } from 'immutable';
import Icon from '../Icon';

const propTypes = {
  menus: PropTypes.array.isRequired,
  className: PropTypes.string,
  location: PropTypes.object,
  role: PropTypes.oneOf(['tree', 'menu']),
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

const defaultProps = {
  menus: [],
  isTree: false,
  role: 'menu',
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
      onClick={(e) => props.onClick(path, e)}
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
  onClick: PropTypes.func,
};


class Nav extends Component {
  constructor(props) {
    super(props);

    // this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
  }

  onSelectItem(path, e) {
    if (this.props.onChange) {
      this.props.onChange(path, e);
    }
  }
  render() {
    const { className, menus, location, role } = this.props;
    let navClassName = className || '';
    let linkClassName = 'm-menu__link';
    let isTree = false;

    navClassName = `${navClassName} o-nav`;
    linkClassName = `${linkClassName} o-nav__link`;

    if (role === 'tree') {
      navClassName = `${navClassName} o-nav--tree`;
      isTree = true;
    }
    return (
      <nav
        className={navClassName}
        style={this.props.style}
        onClick={this.props.onClick}
      >
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
                    onClick={this.onSelectItem}
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
                                  onClick={this.onSelectItem}
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

