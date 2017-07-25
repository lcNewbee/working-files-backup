import React from 'react';
import PropTypes from 'prop-types';

import './_index.scss';

const propTypes = {
  size: PropTypes.oneOf(['sm']),
  style: PropTypes.object,
};
const defaultProps = {
  size: '',
};

class Loading extends React.Component {
  constructor(props) {
    const { id } = props;
    super(props);

    if (!id) {
      this.id = `checkbox_${Math.random()}`;
    } else {
      this.id = id;
    }
  }
  render() {
    const { size, style } = this.props;
    let myClassnames = 'a-heart';

    if (size) {
      myClassnames = `${myClassnames} a-heart--${size}`;
    }

    return (
      <div className={myClassnames} style={style}>
        <div className="a-heart-piece-0" />
        <div className="a-heart-piece-1" />
        <div className="a-heart-piece-2" />
        <div className="a-heart-piece-3" />
        <div className="a-heart-piece-4" />
        <div className="a-heart-piece-5" />
        <div className="a-heart-piece-6" />
        <div className="a-heart-piece-7" />
        <div className="a-heart-piece-8" />
      </div>
    );
  }
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;

