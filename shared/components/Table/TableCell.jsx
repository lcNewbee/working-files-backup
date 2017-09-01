import React from 'react';
import PropTypes from 'prop-types';
import utilsCore from 'shared/utils/lib/core';
import PureComponent from '../Base/PureComponent';

const propTypes = {
  record: PropTypes.object,
  index: PropTypes.number,
  indent: PropTypes.number,
  indentSize: PropTypes.number,
  column: PropTypes.object,
  expandIcon: PropTypes.node,
  onCellClick: PropTypes.func,
  curSelectable: PropTypes.bool,
};

const defaultProps = {
};

class TableCell extends PureComponent {
  constructor(props) {
    super(props);
    utilsCore.binds(this, [
      'onSelect',
      'handleClick',
    ]);
  }
  handleClick($$cell, e) {
    if (this.props.onCellClick) {
      this.props.onCellClick($$cell, e);
    }
  }

  render() {
    const { record: $$record, index, column: $$colnmn, curSelectable } = this.props;
    const id = $$colnmn.get('id');
    const $$valuePath = $$colnmn.get('valuePath');
    const filterObj = $$colnmn.get('filterObj');
    const thisKey = `tableCell${index}.${id}`;
    const getTitle = $$colnmn.get('getTitle');
    let title;
    let currNode = $$record.get(id);
    let currItemArr = [];
    let currValArr = [];

    if ($$valuePath) {
      currNode = $$record.getIn($$valuePath.toJS());
    }

    if (typeof getTitle === 'function') {
      title = getTitle(currNode, $$record, index);
    }

    // 优先过滤处理值
    if (filterObj && typeof filterObj.transform === 'function') {
      currNode = filterObj.transform(currNode);
    }

    // 如果没有自定义渲染函数，依据配置渲染
    if (!$$colnmn.get('render')) {
      if (currNode !== undefined && currNode !== null) {
        // options 则需要渲染 value 对应的 label 值
        if ($$colnmn.get('options') && $$colnmn.get('options').size > 0) {
          // 如果是多选 则找出值对应的 label，组成一个数组
          if ($$colnmn.get('multi')) {
            currItemArr = currNode.split(',').map(
              itemVal => $$colnmn.get('options').find((myMap) => {
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
              $$colnmn.get('options').find((myMap) => {
                let ret = false;

                if (myMap && typeof myMap.get === 'function') {
                  ret = myMap.get('value') === currNode;
                } else { // options immutable数组的内容除了是Map外，还可以是字符串。
                  ret = myMap === currNode;
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
                  } else if ($$currItem.get('color')) {
                    retVal = (
                      <span
                        style={{
                          color: $$currItem.get('color'),
                        }}
                      >{$$currItem.get('label')}</span>
                    );
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
          currNode = [];
          currValArr.forEach(
            (curVal, n) => {
              currNode.push(curVal);

              if (n < currValArr.length - 1) {
                currNode.push(', ');
              }
            },
          );
        } else if (currValArr.length === 1) {
          currNode = currValArr[0];
        }

        // 显示默认值
      } else {
        currNode = $$colnmn.get('defaultValue') || '';
      }

    // 使用自定义渲染函数
    } else {
      currNode = $$colnmn.get('render')(currNode, $$record, $$colnmn.merge({
        __index__: index,
        curSelectable,
      }));
    }

    return (
      <td
        key={thisKey}
        title={title}
        onClick={(e) => {
          this.handleClick($$record, e);
        }}
      >
        { currNode }
      </td>
    );
  }
}

TableCell.propTypes = propTypes;
TableCell.defaultProps = defaultProps;

export default TableCell;
