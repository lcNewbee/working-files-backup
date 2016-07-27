import React, { Component, PropTypes } from 'react';
// import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';
import { fromJS } from 'immutable';
import Icon from '../Icon';

const propTypes = {
  menus: PropTypes.array.isRequired,
  className: PropTypes.string,
  location: PropTypes.object,

  // 是否渲染多级菜单
  isTree: PropTypes.bool,
};

const defaultProps = {
  menus: [],
  isTree: false,
};

function NavList(props) {
  const { item, icon } = props;

  return (<li>
    <Link to={item.get('path')} className="o-nav__link" activeClassName="active">
      {
        icon ? <Icon name={icon} /> : null
      }
      {item.get('text')}
    </Link>
  </li>);
}

class Nav extends Component {
  constructor(props) {
    super(props);

    // this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
  }
  onSelectItem() {

  }
  render() {
    const { className, menus, location, isTree } = this.props;
    return (
      <nav className={className}>
        <ul className="o-nav__menus">
          {
            fromJS(menus).map((item, i) => {
              const icon = item.get('icon');
              const myKey = `nav${i}`;
              const hasSubmenus = isTree && item.get('childRoutes');
              let listClassName = 'o-nav__list';
              let isActive = false;

              if (location && location.pathname) {
                isActive = location.pathname.indexOf(`${item.get('path')}/`) === 0
                  || location.pathname === item.get('path');
              }

              if (isActive) {
                listClassName = `${listClassName} active`;
              }

              return (
                <li key={myKey} className={listClassName}>
                  <Link to={item.get('path')} className="o-nav__link" activeClassName="active">
                    {
                      icon ? <Icon name={icon} /> : null
                    }
                    {item.get('text')}
                  </Link>
                  {
                    hasSubmenus ? (
                      <ul className="o-nav__sub-menus">
                        {
                          item.get('childRoutes').map((subItem, n) => {
                            const thisKey = `${myKey}.${n}`;
                            return (<NavList
                              key={thisKey}
                              item={subItem}
                              icon={subItem.get('icon')}
                            />);
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

