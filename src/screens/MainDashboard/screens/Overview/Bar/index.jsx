import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'shared/components';

import './_index.scss';

const propTypes = {
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.string,
  unit: PropTypes.string,
  scale: PropTypes.number,
  style: PropTypes.object,
};
const defaultProps = {
  max: 100,
  min: 0,
  scale: 5,
};

export default class View extends React.PureComponent {
  render() {
    const { min, max, value, unit, scale, style } = this.props;
    const valuePecent = Number(value / (max - min)) * 100;
    const scaleStep = parseInt((max - min) / scale, 10);
    const len = parseInt(scale, 10);
    let valueClassnames = 'rw-bar__scale__value';
    let classNames = 'rw-bar';
    let i = 0;
    let scaleValueNodes = null;

    if (scale) {
      classNames += ' rw-bar--scale';
      scaleValueNodes = [];

      for (i = 0; i < len; i += 1) {
        valueClassnames = classnames({
          'rw-bar__scale__value': true,
          last: i === 0,
        });
        scaleValueNodes.unshift((
          <div
            className={valueClassnames}
            style={{
              height: `${(100 / scale)}%`,
            }}
            key={i}
          >
            <span>{parseInt(min, 10) + (scaleStep * i) + scaleStep}</span>
          </div>
        ));
      }
    }

    return (
      <div
        className={classNames}
        style={style}
      >
        <div className="rw-bar__value">
          <div
            className="rw-bar__value__inner"
            style={{
              height: `${valuePecent}%`,
            }}
          />
        </div>
        <div
          className="rw-bar__scale"
        >
          {scaleValueNodes}
          <span>{min}</span>
        </div>
        <div
          className="rw-bar__line"
          style={{
            bottom: `${valuePecent}%`,
          }}
        />
      </div>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;
