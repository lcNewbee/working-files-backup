import React from 'react';
import PropTypes from 'prop-types';

import './_index.scss';

const propsTypes = {
  time: PropTypes.number,
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
    return (
      <div className="flex-container">
        <div className="unit">
          <div className="heart">
            <div className="heart-piece-0" />
            <div className="heart-piece-1" />
            <div className="heart-piece-2" />
            <div className="heart-piece-3" />
            <div className="heart-piece-4" />
            <div className="heart-piece-5" />
            <div className="heart-piece-6" />
            <div className="heart-piece-7" />
            <div className="heart-piece-8" />
          </div>
          <p>love is love</p>
        </div>
      </div>
    );
  }
}

Loading.propsTypes = propsTypes;

export default Loading;

