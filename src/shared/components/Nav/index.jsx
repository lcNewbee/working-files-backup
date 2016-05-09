import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Immutable, {fromJS} from 'immutable';

const propTypes = {
  menus: PropTypes.array.isRequired
};

class Nav extends Component{
  render() {
    
    return (
      <nav {...this.props}>
        <ul>
          {
            fromJS(this.props.menus).map(function(item, i) {
              return <li key={'nav' + i}>
                <Link to={item.get('path')} activeClassName="active">
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


