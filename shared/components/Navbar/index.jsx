import React from 'react'; import PropTypes from 'prop-types';
import './_index.scss';

const propTypes = {
  title: PropTypes.string,
  version: PropTypes.string,
  children: PropTypes.any,
  theme: PropTypes.oneOf(['metro']),
};

const defaultProps = {

};

function Navbar(props) {
  const { title, version, theme } = props;
  let navbarClassName = 'navbar';

  if (theme) {
    navbarClassName = `${navbarClassName} navbar--${theme}`;
  }
  return (
    <header className={navbarClassName}>
      <div className="brand" />
      <h1>{title}</h1>
      {
        version ? (
          <span className="version">{version}</span>
        ) : null
      }

      {props.children}
    </header>
  );
}

Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;

export default Navbar;
