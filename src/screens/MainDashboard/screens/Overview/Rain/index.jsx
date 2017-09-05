import React from 'react'; import PropTypes from 'prop-types';
import { Icon } from 'shared/components';

import './_index.scss';

const propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  warningLevel: PropTypes.oneOf(['1', '2', '3', '4']),
  text: PropTypes.string,
  active: PropTypes.bool,
};
const defaultProps = {
  size: 4,
  level: 1,
};

export default class Rain extends React.PureComponent {
  render() {
    const { text, warningLevel, active, size } = this.props;
    const levalClassname = `rw-rain__level rw-rain__level-${warningLevel}`;
    const tintSize = parseInt(size, 10);
    let i = 0;
    let classNames = `rw-rain rw-rain--level-${warningLevel}`;
    let tintNodes = null;

    if (active) {
      classNames += ' active';
    }

    if (tintSize > 0) {
      tintNodes = [];
      for (i; i < tintSize; i += 1) {
        tintNodes.push(<Icon name="tint" key={i} />);
      }
    }

    return (
      <div className={classNames}>
        <div className="rw-rain__icon">
          <Icon name="cloud" />
          <div className={levalClassname}>
            {tintNodes}
          </div>
        </div>
        <div className="rw-rain__text">
          <span>{text}</span>
        </div>
      </div>
    );
  }
}

Rain.propTypes = propTypes;
Rain.defaultProps = defaultProps;
