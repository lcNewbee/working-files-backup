import React, { Component, PropTypes } from 'react';
// import PureRenderMixin from 'react-addons-pure-render-mixin';
import Checkbox from 'shared/components/Form/Checkbox';
import Icon from 'shared/components/Icon';
import utilsCore from 'shared/utils/lib/core';

const propTypes = {
  options: PropTypes.object.isRequired,
  isTh: PropTypes.bool,
  item: PropTypes.object,
  index: PropTypes.number,
  selectable: PropTypes.bool,
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
    ]);
  }
  onSelect(index_, e) {
    this.props.onSelect({
      index: index_,
      selected: e.target.checked,
    });
  }
  render() {
    const { isTh, options, selected, selectable, item, index, ...restProps } = this.props;
    let rowChilren = null;
    let MyCompeont = 'td';

    // 渲染表格头部 th
    if (isTh) {
      MyCompeont = 'th';
      rowChilren = options.map(
        ($$curThOption) => {
          let myOption = $$curThOption;

          if (myOption && typeof myOption.toJS === 'function') {
            myOption = myOption.toJS();
          }

          return myOption ? (
            <MyCompeont
              key={`tableRow${myOption.id}`}
              width={myOption.width}
            >
              <span>{myOption.text || myOption.label}</span>
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
            </MyCompeont>
          ) : null;
        },
      );

    // item存在时，渲染 tbody 内容 td
    } else if (item) {
      rowChilren = options.map(
        ($$curTdOption) => {
          const id = $$curTdOption.get('id');
          const filterObj = $$curTdOption.get('filterObj');
          const thisKey = `tableRow${id}`;
          const originVal = item.get(id);
          let currVal = originVal;
          let currItemArr = [];
          let currValArr = [];

          // 优先过滤处理值
          if (filterObj && typeof filterObj.transform === 'function') {
            currVal = filterObj.transform(currVal);
          }

          // 如果没有自定义渲染函数，依据配置渲染
          if (!$$curTdOption.get('transform')) {
            if (currVal !== undefined) {
              // options 则需要渲染 value 对应的 label 值
              if ($$curTdOption.get('options') && $$curTdOption.get('options').size > 0) {
                // 如果是多选
                if ($$curTdOption.get('multi')) { // 多选则找出值对应的label，组成一个数组
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

                    if ($$currItem) {
                      // 如果是 map 对象
                      if (typeof $$currItem.get === 'function') {
                        if (typeof $$currItem.get('render') === 'function') {
                          retVal = $$currItem.get('render')();
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
            currVal = $$curTdOption.get('transform')(currVal, item, index);
          }

          return (
            <MyCompeont key={thisKey}>
              { currVal }
            </MyCompeont>
          );
        },
      );
    }

    // 添加选择列
    if (selectable) {
      rowChilren = rowChilren.unshift((
        <MyCompeont
          width="15"
          key="tableRow_select"
        >
          <Checkbox
            theme="square"
            checked={selected}
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
