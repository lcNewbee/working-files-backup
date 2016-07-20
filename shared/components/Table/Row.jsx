import React, { PropTypes } from 'react';

const propTypes = {
  options: PropTypes.object,
  isTh: PropTypes.bool,
  item: PropTypes.object,
};

const defaultProps = {
  isTh: false,
};

function Row(props) {
  let tds;

  if (props.isTh) {
    tds = props.options.map((option, i) =>
      <th key={`tableRow${i}`} width={option.get('width')}>
        {option.get('text')}
      </th>
    );
  } else {
    tds = props.options.map((option, i) => {
      const id = option.get('id');
      const filterObj = option.get('filterObj');
      const thisKey = `tableRow${i}`;
      let currVal = props.item.get(id);

      let tdDom = null;

      if (filterObj && typeof filterObj.transform === 'function') {
        currVal = filterObj.transform(currVal);
      }

      if (!option.get('transform')) {
        tdDom = <td key={thisKey}>{currVal}</td>;
      } else {
        tdDom = (
          <td key={thisKey}>
            {option.get('transform')(currVal, props.item)}
          </td>
        );
      }

      return tdDom;
    });
  }

  return (
    <tr>
      {tds}
    </tr>
  );
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;
