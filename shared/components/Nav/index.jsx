import React, { Component, PropTypes } from 'react';
import { NavLink as Link } from 'react-router-dom';
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
  const { item, className, hasSubmenus, hasTabs } = props;
  const { icon, path, text } = item.toJS();
  let branchIconName = 'caret-right';
  let CurComponent = Link;
  let toggleIconClassName = 'o-nav__icon-toggle';
  let linkProps = {
    to: path,
    activeClassName: 'active',
  };

  if (hasTabs) {
    branchIconName = 'ellipsis-v';
    toggleIconClassName = 'o-nav__icon-tabs';
  }
  if (hasSubmenus) {
    CurComponent = 'a';
    linkProps = null;
  }

  return (
    <CurComponent
      {...linkProps}
      className={className}
      onClick={e => props.onClick(path, e)}
    >
      {
        hasSubmenus || hasTabs ? (
          <Icon
            className={toggleIconClassName}
            name={branchIconName}
          />
        ) : null
      }
      {
        icon ? (
          <Icon
            className="o-nav__link-avatar"
            name={icon}
          />
        ) : null
      }
      {text}
    </CurComponent>
  );
}
NavLink.propTypes = {
  item: PropTypes.object.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  hasSubmenus: PropTypes.any,
  hasTabs: PropTypes.any,
};


class Nav extends React.PureComponent {
  constructor(props) {
    super(props);

    // this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.onToggleBranch = this.onToggleBranch.bind(this);

    this.state = {};
  }
  componentDidMount() {
    if (this.defaultOpen) {
      this.setState({
        [this.defaultOpen]: !this.state[this.defaultOpen],
      });
      this.defaultOpen = '';
    }
  }

  onSelectItem(path, e) {
    if (this.props.onChange) {
      this.props.onChange(path, e);
    }
  }
  onToggleBranch(id) {
    this.setState({
      [id]: !this.state[id],
    });
  }

  render() {
    const { className, menus, location, role } = this.props;
    let navClassName = className || '';

    let isTree = false;

    navClassName = `${navClassName} o-nav`;
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
            fromJS(menus).map((item) => {
              const myKey = item.get('id');
              const hasChildRoutes = isTree && item.get('routes');
              const hasSubmenus = hasChildRoutes && !item.get('noTree');
              const hasTabs = hasChildRoutes && item.get('noTree');
              let subMenuClassName = 'o-nav__sub-menus m-menu';
              let linkClassName = 'm-menu__link o-nav__link';
              let isActive = false;
              let isOpen = this.state[myKey];

              if (item.get('noNav')) {
                return null;
              }

              if (location && location.pathname) {
                isActive = location.pathname.indexOf(`${item.get('path')}/`) === 0
                  || location.pathname === item.get('path');
              }

              if (!hasSubmenus) {
                linkClassName = `${linkClassName} a-leaf-link`;
              } else {
                linkClassName = `${linkClassName} a-branch-link`;
                if (isActive && isOpen === undefined) {
                  this.defaultOpen = myKey;
                }
              }

              if (isOpen) {
                subMenuClassName = `${subMenuClassName} m-menu--open`;
                linkClassName = `${linkClassName} is-open`;
              }

              if (isActive) {
                linkClassName = `${linkClassName} active`;
              }

              return (
                <li key={myKey}>
                  <NavLink
                    item={item}
                    className={linkClassName}
                    hasSubmenus={hasSubmenus}
                    hasTabs={hasTabs}
                    onClick={() => {
                      if (hasSubmenus) {
                        this.onToggleBranch(myKey);
                      }
                    }}
                  />
                  {
                    isOpen ? (
                      <ul className={subMenuClassName}>
                        {
                          item.get('routes').map(($$subItem) => {
                            const thisKey = $$subItem.get('id');
                            const subHasSubmenus = $$subItem.get('routes');
                            const subHasTabs = subHasSubmenus && $$subItem.get('component');
                            const mylinkClassName = 'm-menu__link o-nav__link a-leaf-link';

                            if ($$subItem.get('noNav')) {
                              return null;
                            }

                            return (
                              <li key={thisKey}>
                                <NavLink
                                  item={$$subItem}
                                  hasSubmenus={false}
                                  hasTabs={subHasTabs}
                                  className={mylinkClassName}
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

