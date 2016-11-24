import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { List, fromJS } from 'immutable';
import Checkbox from './Checkbox';

const propTypes = {
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onChange: PropTypes.func,
  splitStr: PropTypes.string,
  value: PropTypes.string,
};

const defaultProps = {
  type: 'checkbox',
  splitStr: ',',
  onValue: 1,
  offValue: 0,
};

class Checkboxs extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.valueArrState = [];
  }

  onChange(e, index, $$item) {
    const isChecked = e.target.checked;
    const label = $$item.get('label');
    let curValue = '';

    if (isChecked) {
      this.valueArrState[index] = $$item.get('value');
    } else {
      this.valueArrState[index] = false;
    }

    curValue = this.valueArrState.filter(
      state => state,
    ).join(this.props.splitStr);

    if (this.props.onChange) {
      this.props.onChange({
        value: curValue,
        label,
      });
    }
  }
  render() {
    const { valueArrState } = this;
    const { options, value, splitStr } = this.props;
    const valueArr = (value || '').split(splitStr);
    let optionsList;

    if (!List.isList(options)) {
      optionsList = fromJS(options);
    } else {
      optionsList = options;
    }

    return (
      <div className="m-checkboxs">
        {
          optionsList.map(
            ($$item, i) => {
              const thisVal = $$item.get('value');
              const isChecked = valueArr.indexOf(thisVal) !== -1;

              if (isChecked) {
                valueArrState[i] = thisVal;
              } else {
                valueArrState[i] = false;
              }

              return (
                <Checkbox
                  key={`checkboxs${i}`}
                  type="checkbox"
                  theme="square"
                  value={thisVal}
                  text={_($$item.get('label'))}
                  checked={isChecked}
                  onChange={
                    e => this.onChange(e, i, $$item)
                  }
                />
              );
            },
          )
        }
      </div>
    );
  }
}

Checkboxs.propTypes = propTypes;
Checkboxs.defaultProps = defaultProps;

export default Checkboxs;
