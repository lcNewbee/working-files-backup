import React from 'react';
import PropTypes from 'prop-types';

import './Navbar.scss';

const propTypes = {
  title: PropTypes.string,
  version: PropTypes.string,
  slogan: PropTypes.string,
  children: PropTypes.node,
  theme: PropTypes.oneOf(['metro']),
};

const defaultProps = {

};

function Navbar(props) {
  const { title, version, theme, slogan } = props;
  let navbarClassName = 'navbar';

  if (theme) {
    navbarClassName = `${navbarClassName} navbar--${theme}`;
  }
  return (
    <header className={navbarClassName}>
      <img alt="logo" className="brand" src="images/logo.png" />
      <h1>{title}</h1>
      {
        version ? (
          <span className="version">{version}</span>
        ) : null
      }
      {
        slogan ? (
          <div className="slogan-wrap">
            <span className="slogan">{slogan}</span>
          </div>
        ) : null
      }
      {props.children}
    </header>
  );
}

Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;

export default Navbar;
