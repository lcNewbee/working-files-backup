import React from 'react';
import {Link} from 'react-router';
const ACTIVE = { color: 'red' }

export default React.createClass({
  render: function() {
    var navList = [];

    this.props.mainNav.forEach(function(item, i) {
      navList.push(
        <li key={'nav' + i}>
          <Link to={item.path} activeStyle={ACTIVE}>
            {item.text}
          </Link>
        </li>
      );
    });

    return (
      <nav {...this.props}>
        <ul>
          {navList}
        </ul>
      </nav>
    );
  }
});
