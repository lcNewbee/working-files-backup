import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const propTypes = {
  options: PropTypes.object,
  isTh: PropTypes.bool,
  item: PropTypes.object,
  index: PropTypes.number,
  selectable: PropTypes.bool,
  isSelectAll: PropTypes.bool,
  onSelect: PropTypes.func,
};

const defaultProps = {
  isTh: false,
};

class Row extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(index_, e) {
    if (this.props.onSelect) {
      this.props.onSelect({
        index: index_,
        selected: e.target.checked,
      });
    }
  }
  render() {
    const { isTh, options, isSelectAll, selectable, item, index } = this.props;
    let tds;

    if (isTh) {
      tds = options.map((option, i) =>
        <th key={`tableRow${i}`} width={option.get('width')}>
          {option.get('text') || option.get('label')}
        </th>
      );

      if (selectable) {
        tds = tds.unshift((
          <th width="15" key="tableRow_select">
            <input
              type="checkbox"
              checked={isSelectAll}
              onChange={(e) => {
                this.onSelect(-1, e);
              }}
            />
          </th>
        ));
      }
    } else {
      tds = options.map((option, i) => {
        const id = option.get('id');
        const filterObj = option.get('filterObj');
        const thisKey = `tableRow${i}`;
        let currVal = item.get(id);
        let currItem = null;
        let tdDom = null;

        if (filterObj && typeof filterObj.transform === 'function') {
          currVal = filterObj.transform(currVal);
        }

        if (!option.get('transform')) {
          if (option.get('options') && option.get('options').size > 0) {
            currItem = option.get('options').find((myMap) => {
              let ret = false;

              if (myMap && typeof myMap.get === 'function') {
                ret = myMap.get('value') === currVal;
              } else {
                ret = myMap === currVal;
              }
              return ret;
            });

            if (currItem) {
              if (typeof currItem.get === 'function') {
                currVal = currItem.get('label');
              } else {
                currVal = currItem;
              }
            }
          }

          tdDom = <td key={thisKey}>{currVal}</td>;
        } else {
          tdDom = (
            <td key={thisKey}>
              {option.get('transform')(currVal, item, index)}
            </td>
          );
        }

        return tdDom;
      });

      if (selectable) {
        tds = tds.unshift((
          <td width="15" key="tableRow_select">
            <input
              type="checkbox"
              checked={!!item.get('_selected')}
              onChange={(e) => {
                this.onSelect(index, e);
              }}
            />
          </td>
        ));
      }
    }

    return (
      <tr>
        {tds}
      </tr>
    );
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;
