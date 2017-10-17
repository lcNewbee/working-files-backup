import React from 'react';
import PropTypes from 'prop-types';
import utilsCore from 'shared/utils/lib/core';
import RcTooltip from 'rc-tooltip';
import classnams from 'classnames';
import Checkbox from '../Form/Checkbox';
import Icon from '../Icon';
import PureComponent from '../Base/PureComponent';

const propTypes = {
  allColumns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  showColumns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  columns: PropTypes.object.isRequired,
  configurable: PropTypes.bool,
  onSelect: PropTypes.func,
  onColumnSort: PropTypes.func,
  onColumnsConfig: PropTypes.func,
  fixedRowsHeight: PropTypes.array,
  fixed: PropTypes.string,
};

const defaultProps = {
  item: null,
  selectable: false,
  selected: false,
  configurable: true,
  onSelect: utilsCore.emptyfunc,
  onColumnSort: utilsCore.emptyfunc,
  index: -1,
};

class TableHeader extends PureComponent {
  constructor(props) {
    super(props);
    utilsCore.binds(this, [
      'onSelect',
      'renderThList',
      'onColumnSort',
      'renderColumnsConfig',
      'onColumnsConfigVisibleChange',
    ]);
    this.state = {
      visible: false,
    };
  }
  onSelect(index_, e) {
    this.props.onSelect({
      index: index_,
      selected: e.target.checked,
    });
  }

  /**
   *
   *
   * @param {string} dataIndex 数据ID
   * @param {string} type 'desc'降序 'asc'升序
   * @memberof TableHeader
   */
  onColumnSort(dataIndex, type) {
    this.props.onColumnSort(dataIndex, type);
  }

  onColumnsConfigVisibleChange(visible) {
    this.setState({ visible });
  }

  renderColumnsConfig() {
    const { showColumns, allColumns } = this.props;
    const popOverlay = (
      <div className="rw-table-config">
        {
          allColumns.map(($$curThOption, i) => {
            const curThOption = typeof $$curThOption.toJS === 'function' ? $$curThOption.toJS() : $$curThOption;
            const checked = showColumns.find($$item => $$item.get('id') === curThOption.id);
            const isAction = curThOption.id === '__actions__';
            const onlyOne = showColumns.size === 1;
            const disabled = onlyOne && checked;
            const myClassnames = classnams('rw-table-config__list', {
              disabled,
            });

            return isAction ? null : (
              <div
                key={curThOption.id || i}
                className={myClassnames}
              >
                <Checkbox
                  theme="square"
                  text={curThOption.text || curThOption.label}
                  onChange={(e) => {
                    this.props.onColumnsConfig(curThOption.id, e.target.checked);
                  }}
                  disabled={disabled}
                  checked={!!checked}
                />
              </div>
            );
          })
        }
      </div>
    );

    return (
      <RcTooltip
        prefixCls="rw-tooltip"
        trigger="click"
        overlay={popOverlay}
        visible={this.state.visible}
        onVisibleChange={this.onColumnsConfigVisibleChange}
        placement="bottomRight"
      >
        <Icon
          name="list"
          style={{
            marginLeft: '5px',
            cursor: 'pointer',
            float: 'right',
            lineHeight: '1.42857',
          }}
          onClick={() => {
            this.onColumnsConfigVisibleChange(!this.state.visible);
          }}
        />
      </RcTooltip>
    );
  }

  renderThList() {
    const { columns, configurable, fixed } = this.props;
    const columnsLen = columns.size;

    return columns.map(
      ($$curThOption, index) => {
        const isLast = fixed !== 'left' && index === columnsLen - 1;
        const myOption = typeof $$curThOption.toJS === 'function' ? $$curThOption.toJS() : $$curThOption;
        const dataIndex = myOption.id;
        const textStyle = {};

        if (isLast && configurable) {
          console.log(22)
          textStyle.float = 'left';
        }

        /* ******************************************************
          width:调整表格项的宽度。
          paddingLeft：调整表头标题的位置
          marginLeft：调整表头标题的位置，相当于paddingLeft的负值
        ******************************************************* */
        return myOption ? (
          <th
            key={`tableRow${dataIndex}`}
            style={{
              paddingLeft: myOption.paddingLeft,
            }}
          >
            <span
              style={textStyle}
            >
              {myOption.text || myOption.label}
            </span>
            {
              myOption.sortable ? (
                <Icon
                  name="sort"
                  style={{
                    marginLeft: '5px',
                    cursor: 'pointer',
                  }}
                  id={`${dataIndex}SortIcon`}
                  onClick={() => {
                    this.onColumnSort(dataIndex);
                  }}
                />
              ) : null
            }
            {
              isLast && configurable ? this.renderColumnsConfig() : null
            }
          </th>
        ) : null;
      },
    );
  }

  render() {
    const { fixedRowsHeight, fixed } = this.props;
    let trStyle = null;
    let rowChilren = null;

    rowChilren = this.renderThList();

    if (fixedRowsHeight && fixed && fixedRowsHeight[0]) {
      trStyle = {
        height: `${fixedRowsHeight[0]}px`,
      };
    }
    return rowChilren ? (
      <thead>
        <tr style={trStyle}>
          {rowChilren}
        </tr>
      </thead>
    ) : null;
  }
}

TableHeader.propTypes = propTypes;
TableHeader.defaultProps = defaultProps;

export default TableHeader;
