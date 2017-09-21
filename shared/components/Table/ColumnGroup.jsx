import React from 'react';
import PropTypes from 'prop-types';
import utilsCore from 'shared/utils/lib/core';
import PureComponent from '../Base/PureComponent';
import { getSizeStyleUnit } from './utils';

import './_index.scss';


const propTypes = {
  columns: PropTypes.object.isRequired,
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
    const { columns } = this.props;
    let myCols = [];

    if (!columns) {
      return null;
    }

    myCols = columns.map(($$column, i) => {
      const myOption = typeof $$column.toJS === 'function' ? $$column.toJS() : $$column;
      const widthString = getSizeStyleUnit(myOption.width);
      const key = $$column.get('id') || i;

      return (
        <col
          key={key}
          style={{
            minWidth: widthString,
            width: widthString,
          }}
        />
      );
    });

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
