import React, { PropTypes } from 'react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import 'rc-time-picker/assets/index.css';
import './_index.scss';

const propTypes = {
  showSecond: PropTypes.bool,
  formatter: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string, PropTypes.object,
  ]),
};
const defaultProps = {
  isAsync: false,
  placeholder: __('Please Select '),
};

class MyTimePicker extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { showSecond, value, formatter } = this.props;
    const ThisComponent = TimePicker;
    let timeValue = value;
    let timeFormat = 'HH:mm:ss';

    if (formatter) {
      timeFormat = formatter;
    } else if (!showSecond) {
      timeFormat = 'HH:mm';
    }

    if (!moment.isMoment(timeValue)) {
      timeValue = moment(timeValue, timeFormat);
    }

    return (
      <ThisComponent
        {...this.props}
        value={timeValue}
      />
    );
  }
}
MyTimePicker.propTypes = propTypes;
MyTimePicker.defaultProps = defaultProps;

export default MyTimePicker;
