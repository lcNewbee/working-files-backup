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
  onRowMouseEnter: PropTypes.func,
  onRowMouseLeave: PropTypes.func,
  onHover: PropTypes.func,
  hoverKey: PropTypes.string,
  curRowHoverKey: PropTypes.string,
};

const defaultProps = {
  item: null,
  selectable: false,
  selected: false,
  onSelect: utilsCore.noop,
  onClick: utilsCore.noop,
  onHover: utilsCore.noop,
  onRowMouseEnter: utilsCore.noop,
  onRowMouseLeave: utilsCore.noop,
  index: -1,
};

class Row extends PureComponent {
  constructor(props) {
    super(props);
    utilsCore.binds(this, [
      'onSelect',
      'renderThList',
      'onMouseEnter',
      'onMouseLeave',
    ]);
  }
  onSelect(index_, e) {
    this.props.onSelect({
      index: index_,
      selected: e.target.checked,
    });
  }
  onMouseEnter(event) {
    const { item, index, onRowMouseEnter, onHover, hoverKey } = this.props;
    onHover(true, hoverKey);
    onRowMouseEnter(item, index, event);
  }

  onMouseLeave(event) {
    const { item, index, onRowMouseLeave, onHover, hoverKey } = this.props;

    onHover(false, hoverKey);
    onRowMouseLeave(item, index, event);
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
      item, index, curRowHoverKey, hoverKey, ...restProps
    } = this.props;
    let rowChilren = [];
    let rowClassNames = '';

    if (curRowHoverKey === hoverKey) {
      rowClassNames = 'rw-table-row-hover';
    }

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
      <tr
        {...restProps}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        className={rowClassNames}
      >
        { rowChilren }
      </tr>
    ) : null;
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;
