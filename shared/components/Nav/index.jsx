import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { fromJS } from 'immutable';
import Icon from '../Icon';

const propTypes = {
  menus: PropTypes.array.isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  menus: [],
};

class Nav extends Component {
  constructor(props) {
    super(props);
    this.onSelectItem = this.onSelectItem.bind(this);
  }
  onSelectItem() {

  }
  render() {
    const { className, menus } = this.props;

    return (
      <nav className={className}>
        <ul>
          {
            fromJS(menus).map((item, i) => {
              const icon = item.get('icon');
              const myKey = `nav${i}`;

              return (<li key={myKey}>
                <Link to={item.get('path')} activeClassName="active">
                  {
                    icon ? <Icon name={icon} /> : null
                  }
                  {item.get('text')}
                </Link>
              </li>);
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

