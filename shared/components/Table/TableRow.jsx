import React from 'react';
import PropTypes from 'prop-types';
import utilsCore from 'shared/utils/lib/core';
import Checkbox from '../Form/Checkbox';
import PureComponent from '../Base/PureComponent';
import TableCell from './TableCell';

const propTypes = {
  columns: PropTypes.object.isRequired,
  isTh: PropTypes.bool,
  item: PropTypes.object,
  index: PropTypes.number,
  selectable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),
  curSelectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onClick: PropTypes.func,
};

const defaultProps = {
  item: null,
  selectable: false,
  selected: false,
  onSelect: utilsCore.emptyfunc,
  onClick: utilsCore.emptyfunc,
  index: -1,
};

class Row extends PureComponent {
  constructor(props) {
    super(props);
    utilsCore.binds(this, [
      'onSelect',
      'renderThList',
    ]);
  }
  onSelect(index_, e) {
    this.props.onSelect({
      index: index_,
      selected: e.target.checked,
    });
  }

  renderTdList() {
    const { item, columns, index, curSelectable } = this.props;

    return columns.map(
      ($$curTdOption, i) => (
        <TableCell
          index={index}
          column={$$curTdOption}
          curSelectable={curSelectable}
          record={item}
          key={`${i}`}
        />
      ),
    );
  }

  render() {
    const {
      columns, selected, selectable, curSelectable,
      item, index, ...restProps
    } = this.props;
    let rowChilren = [];

    if (!columns) {
      return null;
    }

    rowChilren = this.renderTdList();

    // // 添加选择列
    // if (selectable && rowChilren) {
    //   rowChilren = rowChilren.unshift((
    //     <td
    //       key="tableRow_select"
    //     >
    //       <Checkbox
    //         theme="square"
    //         checked={curSelectable && selected}
    //         disabled={!curSelectable}
    //         onChange={(e) => {
    //           this.onSelect(index, e);
    //         }}
    //       />
    //     </td>
    //   ));
    // }

    return rowChilren ? (
      <tr {...restProps}>
        { rowChilren }
      </tr>
    ) : null;
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;
