import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Immutable, {fromJS} from 'immutable';
import Icon from '../Icon';

const propTypes = {
  menus: PropTypes.array.isRequired
};

const defaultProps = {
  menus: [],
};

class Nav extends Component{
  render() {
    
    return (
      <nav {...this.props}>
        <ul>
          {
            fromJS(this.props.menus).map(function(item, i) {
              var icon = item.get('icon');
              
              return <li key={'nav' + i}>
                <Link to={item.get('path')} activeClassName="active">
                  {
                    icon ? <Icon name={icon} className="icon" /> : null
                  }
                  {item.get('text')}
                </Link>
              </li>;
            })
          }
        </ul>
      </nav>
    );
  }
};

Nav.propTypes = propTypes;

export default Nav;


