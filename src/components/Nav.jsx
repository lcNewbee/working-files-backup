import React from 'react';
import {Link} from 'react-router';
import {fromJS} from 'immutable';

const ACTIVE = { color: 'red' }

export default React.createClass({
  render: function() {
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
});
