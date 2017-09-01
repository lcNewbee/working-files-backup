import React from 'react';
import PropTypes from 'prop-types';
import utilsCore from 'shared/utils/lib/core';
import PureComponent from '../Base/PureComponent';

import './_index.scss';

const propTypes = {
  columns: PropTypes.object.isRequired,
  selectable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),
};

const defaultProps = {};

class ColumnGroup extends PureComponent {
  constructor(props) {
    super(props);
    utilsCore.binds(this, [
      'onSelect',
    ]);
  }

  render() {
    const { columns, selectable } = this.props;
    let myCols = [];

    if (!columns) {
      return null;
    }

    myCols = columns.map(($$column, i) => {
      const myOption = typeof $$column.toJS === 'function' ? $$column.toJS() : $$column;
      let widthString = myOption.width;

      if (typeof widthString === 'number') {
        widthString = `${widthString}px`;
      }

      return (
        <col
          key={i}
          style={{
            maxWidth: widthString,
            width: widthString,
          }}
        />
      );
    })
    if (selectable) {
      myCols = myCols.unshift((
        <col
          key="selectCol"
          style={{
            width: '15px',
            maxWidth: '15px',
          }}
        />
      ));
    }


    return (
      <colgroup>
        {
          myCols
        }
      </colgroup>
    );
  }
}

ColumnGroup.propTypes = propTypes;
ColumnGroup.defaultProps = defaultProps;

export default ColumnGroup;
