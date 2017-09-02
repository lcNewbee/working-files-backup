import React from 'react';
import PropTypes from 'prop-types';
import utilsCore from 'shared/utils/lib/core';
import RcTooltip from 'rc-tooltip';
import Checkbox from '../Form/Checkbox';
import Icon from '../Icon';
import PureComponent from '../Base/PureComponent';

import './_index.scss';

const propTypes = {
  allColumns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  columns: PropTypes.object.isRequired,
  item: PropTypes.object,
  index: PropTypes.number,
  selectable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),
  curSelectable: PropTypes.bool,
  selected: PropTypes.bool,
  configurable: PropTypes.bool,
  onSelect: PropTypes.func,
  onColumnSort: PropTypes.func,
  onColumnsConfig: PropTypes.func,
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
    const { columns, allColumns } = this.props;
    const popOverlay = (
      <div className="rw-table-config">
        {
          allColumns.map(($$curThOption) => {
            const curThOption = typeof $$curThOption.toJS === 'function' ? $$curThOption.toJS() : $$curThOption;
            const checked = columns.find($$item => $$item.get('id') === curThOption.id);
            const isAction = curThOption.id === '__actions__';

            return isAction ? null : (
              <div
                key={curThOption.id}
              >
                <Checkbox
                  theme="square"
                  text={curThOption.text || curThOption.label}
                  onChange={(e) => {
                    this.props.onColumnsConfig(curThOption.id, e.target.checked);
                  }}
                  disabled={isAction}
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
    const { columns, configurable } = this.props;
    const columnsLen = columns.size;

    return columns.map(
      ($$curThOption, index) => {
        const isLast = index === columnsLen - 1;
        const myOption = typeof $$curThOption.toJS === 'function' ? $$curThOption.toJS() : $$curThOption;
        const dataIndex = myOption.id;

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
              style={{ marginLeft: myOption.marginLeft }}
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
              // isLast && configurable ? this.renderColumnsConfig() : null
            }
          </th>
        ) : null;
      },
    );
  }

  render() {
    const {
      columns, selected, selectable, curSelectable,
      item, onColumnSort, index, ...restProps
    } = this.props;
    let rowChilren = null;

    rowChilren = this.renderThList();

    return rowChilren ? (
      <thead>
        <tr>
          {rowChilren}
        </tr>
      </thead>
    ) : null;
  }
}

TableHeader.propTypes = propTypes;
TableHeader.defaultProps = defaultProps;

export default TableHeader;
