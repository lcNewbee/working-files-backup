import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'shared/components/Form/Checkbox';
import { fromJS, List } from 'immutable';
import Icon from 'shared/components/Icon';
import utilsCore from 'shared/utils/lib/core';

const propTypes = {
  options: PropTypes.object.isRequired,
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
  isTh: false,
  item: null,
  selectable: false,
  selected: false,
  onSelect: utilsCore.emptyfunc,
  onClick: utilsCore.emptyfunc,
  index: -1,
};

class Row extends Component {
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

  renderThList() {
    const { options } = this.props;

    return options.map(
        ($$curThOption) => {
          let myOption = $$curThOption;
          if (myOption && typeof myOption.toJS === 'function') {
            myOption = myOption.toJS();
          }

          return myOption ? (
            /* ******************************************************
            width:调整表格项的宽度。
            paddingLeft：调整表头标题的位置
            marginLeft：调整表头标题的位置，相当于paddingLeft的负值
            ********************************************************/
            <th
              key={`tableRow${myOption.id}`}
              style={{
                width: myOption.width,
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
                    id={`${myOption.id}SortIcon`}
                  />
                ) : null
              }
            </th>
          ) : null;
        },
      );
  }

  renderTdList() {
    const { item, index, options } = this.props;

    return options.map(
        ($$curTdOption) => {
          const id = $$curTdOption.get('id');
          const $$valuePath = $$curTdOption.get('valuePath');
          const filterObj = $$curTdOption.get('filterObj');
          const thisKey = `tableRow${id}`;
          let currVal = item.get(id);
          let currItemArr = [];
          let currValArr = [];

          if ($$valuePath) {
            currVal = item.getIn($$valuePath.toJS());
          }

          // 优先过滤处理值
          if (filterObj && typeof filterObj.transform === 'function') {
            currVal = filterObj.transform(currVal);
          }

          // 如果没有自定义渲染函数，依据配置渲染
          if (!$$curTdOption.get('render')) {
            if (currVal !== undefined && currVal !== null) {
              // options 则需要渲染 value 对应的 label 值
              if ($$curTdOption.get('options') && $$curTdOption.get('options').size > 0) {
                // 如果是多选 则找出值对应的 label，组成一个数组
                if ($$curTdOption.get('multi')) {
                  currItemArr = currVal.split(',').map(
                    itemVal => $$curTdOption.get('options').find((myMap) => {
                      let ret = false;

                      if (myMap && typeof myMap.get === 'function') {
                        ret = myMap.get('value') === itemVal;
                      } else {
                        ret = myMap === itemVal;
                      }
                      return ret;
                    }),
                  );

                // 单选
                } else {
                  currItemArr.push(
                    $$curTdOption.get('options').find((myMap) => {
                      let ret = false;

                      if (myMap && typeof myMap.get === 'function') {
                        ret = myMap.get('value') === currVal;
                      } else { // options immutable数组的内容除了是Map外，还可以是字符串。
                        ret = myMap === currVal;
                      }
                      return ret;
                    }),
                  );
                }

                currValArr = currItemArr.map(
                  ($$currItem) => {
                    let retVal = '';
                    let curRender = null;

                    if ($$currItem) {
                      // 如果是 Imutable map 对象
                      if (typeof $$currItem.get === 'function') {
                        curRender = $$currItem.get('render');

                        if (typeof curRender === 'function') {
                          retVal = curRender();
                        } else {
                          retVal = $$currItem.get('label');
                        }

                      // 文本
                      } else {
                        retVal = $$currItem;
                      }
                    }
                    return retVal;
                  },
                ).filter( // 过滤空值
                  curVal => !!curVal,
                );
              }

              // 如果 node列表长度大于0，需要添加分割符 ','
              if (currValArr.length > 1) {
                currVal = [];
                currValArr.forEach(
                  (curVal, n) => {
                    currVal.push(curVal);

                    if (n < currValArr.length - 1) {
                      currVal.push(', ');
                    }
                  },
                );
              } else if (currValArr.length === 1) {
                currVal = currValArr[0];
              }
            // 显示默认值
            } else {
              currVal = $$curTdOption.get('defaultValue') || '';
            }

          // 使用自定义渲染函数
          } else {
            currVal = $$curTdOption.get('render')(currVal, item, $$curTdOption.merge({
              __index__: index,
            }));
          }

          // 当鼠标停留在列表上，该项是否显示悬浮提示框，如果该列需要，则在options中添加getTitle函数，函数返回的字符串则作为提示内容
          const getTitle = $$curTdOption.get('getTitle');
          const title = typeof (getTitle) === 'function' ? getTitle(currVal, item, index) : null;

          return (
            <td
              key={thisKey}
              title={title}
            >
              { currVal }
            </td>
          );
        },
      );
  }

  render() {
    const {
      isTh, options, selected, selectable, curSelectable,
      item, index, ...restProps
    } = this.props;
    let rowChilren = null;
    let MyCompeont = 'td';

    // 渲染表格头部 th
    if (isTh) {
      MyCompeont = 'th';
      rowChilren = this.renderThList();

    // item存在时，渲染 tbody 内容 td
    } else if (item) {
      rowChilren = this.renderTdList();
    }

    // 添加选择列
    if (selectable && rowChilren) {
      rowChilren = rowChilren.unshift((
        <MyCompeont
          width="15"
          key="tableRow_select"
        >
          <Checkbox
            theme="square"
            checked={curSelectable && selected}
            disabled={!curSelectable}
            onChange={(e) => {
              this.onSelect(index, e);
            }}
          />
        </MyCompeont>
      ));
    }

    return rowChilren ? (
      <tr {...restProps}>
        {rowChilren}
      </tr>
    ) : null;
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;
