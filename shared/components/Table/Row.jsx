import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const propTypes = {
  options: PropTypes.object,
  isTh: PropTypes.bool,
  item: PropTypes.object,
  selectAble: PropTypes.bool,
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
    const props = this.props;
    let tds;

    if (props.isTh) {
      tds = props.options.map((option, i) =>
        <th key={`tableRow${i}`} width={option.get('width')}>
          {option.get('text')}
        </th>
      );

      if (props.selectAble) {
        tds = tds.unshift((
          <th width="15" key="tableRow_select">
            <input
              type="checkbox"
              onChange={(e) => {
                this.onSelect(-1, e);
              }}
            />
          </th>
        ));
      }
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

      if (props.selectAble) {
        tds = tds.unshift((
          <td width="15" key="tableRow_select">
            <input
              type="checkbox"
              checked={!!props.item.get('selected')}
              onChange={(e) => {
                this.onSelect(props.index, e);
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
