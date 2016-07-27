import React, { PropTypes } from 'react';

const propTypes = {
  title: PropTypes.string,
  version: PropTypes.string,
  children: PropTypes.any,
};

const defaultProps = {

};

function Navbar(props) {
  const { title, version } = props;
  return (
    <header className="navbar">
      <div className="brand"></div>
      <h1>{title}</h1>
      <span className="version">GUI {version}</span>
      {props.children}
    </header>
  );
}

Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;

export default Navbar;
